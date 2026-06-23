/* eslint-disable react/prop-types */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";
import { getSocket } from "../api/socket";
import { getIceServers } from "../utility/webrtc";
import { startRingtone, stopRingtone } from "../utility/ringtone";
import { chatKeys } from "../hooks/chat/useChat";
import IncomingCallDialog from "../pages/Chat/call/IncomingCallDialog";
import CallWindow from "../pages/Chat/call/CallWindow";

const CallContext = createContext(null);

/**
 * Manages one-to-one WebRTC voice/video calls end to end: the call state
 * machine, getUserMedia, the RTCPeerConnection, and all signaling over the
 * shared socket. Renders the incoming-call prompt and the in-call window so
 * calls work from anywhere in the app.
 *
 * Call lifecycle (status): idle → outgoing/incoming → connecting → active → idle
 */
export const CallProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // `call` mirrors the live state for rendering; `callRef` is read inside
  // socket handlers (which close over the first render).
  const [call, setCall] = useState(null);
  const callRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);

  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const pendingCandidates = useRef([]);

  const setCallState = useCallback((next) => {
    callRef.current = next;
    setCall(next);
  }, []);

  const patchCall = useCallback((patch) => {
    if (!callRef.current) return;
    const next = { ...callRef.current, ...patch };
    callRef.current = next;
    setCall(next);
  }, []);

  // Tear down media + peer connection, keeping/clearing call as requested.
  const teardown = useCallback(() => {
    stopRingtone();
    if (pcRef.current) {
      pcRef.current.onicecandidate = null;
      pcRef.current.ontrack = null;
      pcRef.current.onconnectionstatechange = null;
      try {
        pcRef.current.close();
      } catch {
        /* already closed */
      }
      pcRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    pendingCandidates.current = [];
    setLocalStream(null);
    setRemoteStream(null);
    setMuted(false);
    setCameraOff(false);
  }, []);

  const resetCall = useCallback(() => {
    teardown();
    setCallState(null);
    // A call just finished — refresh the call-history list.
    queryClient.invalidateQueries(chatKeys.calls);
  }, [teardown, setCallState, queryClient]);

  const getMedia = useCallback(async (type) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: type === "video",
    });
    localStreamRef.current = stream;
    setLocalStream(stream);
    return stream;
  }, []);

  const flushCandidates = useCallback(async () => {
    const pc = pcRef.current;
    if (!pc) return;
    const queued = pendingCandidates.current;
    pendingCandidates.current = [];
    for (const c of queued) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(c));
      } catch {
        /* ignore late/duplicate candidates */
      }
    }
  }, []);

  const createPeerConnection = useCallback(
    (callId, partnerId) => {
      const socket = getSocket();
      const pc = new RTCPeerConnection({ iceServers: getIceServers() });

      pc.onicecandidate = (e) => {
        if (e.candidate) {
          socket.emit("call:ice-candidate", {
            callId,
            toUserId: partnerId,
            candidate: e.candidate,
          });
        }
      };

      pc.ontrack = (e) => {
        setRemoteStream(e.streams[0]);
        stopRingtone();
        if (callRef.current && callRef.current.status !== "active") {
          patchCall({ status: "active", startedAt: Date.now() });
        }
      };

      pc.onconnectionstatechange = () => {
        if (["failed", "closed"].includes(pc.connectionState)) {
          if (callRef.current) {
            toast.error("Call connection lost");
            resetCall();
          }
        }
      };

      // Attach the local tracks we already captured.
      if (localStreamRef.current) {
        localStreamRef.current
          .getTracks()
          .forEach((track) => pc.addTrack(track, localStreamRef.current));
      }

      pcRef.current = pc;
      return pc;
    },
    [patchCall, resetCall]
  );

  // ── Imperative API ──
  const startCall = useCallback(
    async (peer, type = "video") => {
      if (callRef.current) return; // already in/﹣handling a call
      const socket = getSocket();
      if (!socket?.connected) {
        toast.error("Not connected — try again in a moment");
        return;
      }
      try {
        await getMedia(type);
      } catch {
        toast.error("Could not access your camera/microphone");
        teardown();
        return;
      }

      socket.emit("call:initiate", { toUserId: peer.id, callType: type }, (res) => {
        if (!res?.ok) {
          toast.error(res?.error || "Could not start the call");
          teardown();
          return;
        }
        createPeerConnection(res.callId, peer.id);
        setCallState({
          status: "outgoing",
          callId: res.callId,
          peer,
          type,
          direction: "outgoing",
        });
        startRingtone();
      });
    },
    [getMedia, teardown, createPeerConnection, setCallState]
  );

  const acceptCall = useCallback(async () => {
    const c = callRef.current;
    if (!c || c.status !== "incoming") return;
    const socket = getSocket();
    stopRingtone();
    try {
      await getMedia(c.type);
    } catch {
      toast.error("Could not access your camera/microphone");
      socket.emit("call:reject", { callId: c.callId, toUserId: c.peer.id });
      resetCall();
      return;
    }
    createPeerConnection(c.callId, c.peer.id);
    patchCall({ status: "connecting" });
    socket.emit("call:accept", { callId: c.callId, toUserId: c.peer.id });
  }, [getMedia, createPeerConnection, patchCall, resetCall]);

  const rejectCall = useCallback(() => {
    const c = callRef.current;
    if (!c) return;
    getSocket().emit("call:reject", { callId: c.callId, toUserId: c.peer.id });
    resetCall();
  }, [resetCall]);

  const endCall = useCallback(() => {
    const c = callRef.current;
    if (!c) return;
    const socket = getSocket();
    if (c.status === "outgoing") {
      socket.emit("call:cancel", { callId: c.callId, toUserId: c.peer.id });
    } else {
      socket.emit("call:end", { callId: c.callId, toUserId: c.peer.id });
    }
    resetCall();
  }, [resetCall]);

  const toggleMute = useCallback(() => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const enabled = stream.getAudioTracks().some((t) => t.enabled);
    stream.getAudioTracks().forEach((t) => {
      t.enabled = !enabled;
    });
    setMuted(enabled);
  }, []);

  const toggleCamera = useCallback(() => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const enabled = stream.getVideoTracks().some((t) => t.enabled);
    stream.getVideoTracks().forEach((t) => {
      t.enabled = !enabled;
    });
    setCameraOff(enabled);
  }, []);

  // ── Socket signaling wiring ──
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return undefined;
    const socket = getSocket();

    const onIncoming = ({ callId, callType, from }) => {
      // Busy → auto-decline so the caller isn't left ringing.
      if (callRef.current) {
        socket.emit("call:reject", { callId, toUserId: from.id });
        return;
      }
      setCallState({
        status: "incoming",
        callId,
        peer: from,
        type: callType,
        direction: "incoming",
      });
      startRingtone();
    };

    const onAccepted = async ({ callId }) => {
      const c = callRef.current;
      if (!c || c.callId !== callId) return;
      stopRingtone();
      patchCall({ status: "connecting" });
      const pc = pcRef.current;
      if (!pc) return;
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("call:offer", {
          callId,
          toUserId: c.peer.id,
          sdp: offer,
        });
      } catch {
        toast.error("Failed to establish the call");
        endCall();
      }
    };

    const onOffer = async ({ callId, sdp }) => {
      const pc = pcRef.current;
      const c = callRef.current;
      if (!pc || !c || c.callId !== callId) return;
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
        await flushCandidates();
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("call:answer", { callId, toUserId: c.peer.id, sdp: answer });
      } catch {
        toast.error("Failed to answer the call");
        endCall();
      }
    };

    const onAnswer = async ({ sdp }) => {
      const pc = pcRef.current;
      if (!pc) return;
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
        await flushCandidates();
      } catch {
        /* ignore */
      }
    };

    const onCandidate = async ({ candidate }) => {
      const pc = pcRef.current;
      if (!candidate) return;
      if (pc?.remoteDescription?.type) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch {
          /* ignore */
        }
      } else {
        pendingCandidates.current.push(candidate);
      }
    };

    const onRejected = () => {
      if (!callRef.current) return;
      toast(`${callRef.current.peer?.firstName || "User"} declined the call`);
      resetCall();
    };
    const onCancelled = () => {
      if (!callRef.current) return;
      toast("Call cancelled");
      resetCall();
    };
    const onEnded = () => {
      if (!callRef.current) return;
      toast("Call ended");
      resetCall();
    };

    socket.on("call:incoming", onIncoming);
    socket.on("call:accepted", onAccepted);
    socket.on("call:offer", onOffer);
    socket.on("call:answer", onAnswer);
    socket.on("call:ice-candidate", onCandidate);
    socket.on("call:rejected", onRejected);
    socket.on("call:cancelled", onCancelled);
    socket.on("call:ended", onEnded);

    return () => {
      socket.off("call:incoming", onIncoming);
      socket.off("call:accepted", onAccepted);
      socket.off("call:offer", onOffer);
      socket.off("call:answer", onAnswer);
      socket.off("call:ice-candidate", onCandidate);
      socket.off("call:rejected", onRejected);
      socket.off("call:cancelled", onCancelled);
      socket.off("call:ended", onEnded);
    };
  }, [
    isAuthenticated,
    user?.id,
    setCallState,
    patchCall,
    flushCandidates,
    resetCall,
    endCall,
  ]);

  // End any call and free devices when the user logs out.
  useEffect(() => {
    if (!isAuthenticated && callRef.current) resetCall();
  }, [isAuthenticated, resetCall]);

  const value = useMemo(
    () => ({
      call,
      localStream,
      remoteStream,
      muted,
      cameraOff,
      inCall: Boolean(call),
      startCall,
      acceptCall,
      rejectCall,
      endCall,
      toggleMute,
      toggleCamera,
    }),
    [
      call,
      localStream,
      remoteStream,
      muted,
      cameraOff,
      startCall,
      acceptCall,
      rejectCall,
      endCall,
      toggleMute,
      toggleCamera,
    ]
  );

  return (
    <CallContext.Provider value={value}>
      {children}
      <IncomingCallDialog />
      <CallWindow />
    </CallContext.Provider>
  );
};

export const useCallContext = () => {
  const ctx = useContext(CallContext);
  if (!ctx) throw new Error("useCallContext must be used within a CallProvider");
  return ctx;
};

export default CallContext;
