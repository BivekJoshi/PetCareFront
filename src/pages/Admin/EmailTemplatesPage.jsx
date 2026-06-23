import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import PageHeader from "../../components/common/PageHeader";
import QueryState from "../../components/common/QueryState";
import {
  useEmailTemplates,
  useEmailTemplateMutation,
  useEmailTemplateReset,
} from "../../hooks/admin/useEmailTemplates";
import { fullName } from "../../utility/format";

// Sample values used only for the live preview (the real values are filled by
// the backend at send time). Mirrors the server's token rules.
const previewTokens = {
  greeting: "Hi Jane,",
  code: "123456",
  spacedCode: "123456".split("").join("&nbsp;&nbsp;"),
  ttlMinutes: "10",
};

const fillPreview = (html = "") =>
  html.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) =>
    Object.prototype.hasOwnProperty.call(previewTokens, key) ? previewTokens[key] : match
  );

const EmailTemplatesPage = () => {
  const query = useEmailTemplates();
  const save = useEmailTemplateMutation();
  const reset = useEmailTemplateReset();
  const templates = useMemo(() => query.data || [], [query.data]);

  const [activeKey, setActiveKey] = useState(null);
  const [draft, setDraft] = useState({ subject: "", html: "" });

  // Default to the first template once data arrives.
  useEffect(() => {
    if (!activeKey && templates.length) setActiveKey(templates[0].key);
  }, [templates, activeKey]);

  const selected = useMemo(
    () => templates.find((t) => t.key === activeKey) || null,
    [templates, activeKey]
  );

  // Re-seed the editor when the selection changes or the saved version updates
  // (save/reset bump updatedAt) — but never while the admin is mid-edit.
  const editorKey = `${activeKey}:${selected?.updatedAt || "default"}:${selected?.isDefault}`;
  useEffect(() => {
    if (selected) setDraft({ subject: selected.subject, html: selected.html });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorKey]);

  const dirty =
    selected && (draft.subject !== selected.subject || draft.html !== selected.html);
  const busy = save.isLoading || reset.isLoading;

  const onSave = () => {
    if (!selected || !dirty || busy) return;
    save.mutate({ key: selected.key, subject: draft.subject, html: draft.html });
  };

  const onReset = () => {
    if (!selected || busy) return;
    reset.mutate(selected.key);
  };

  return (
    <Box>
      <PageHeader
        title="Email Templates"
        subtitle="Edit the transactional emails PetCare sends. Use the {{variables}} below — the backend fills in the real values when each email is sent."
      />

      <QueryState query={query} isEmpty={!templates.length}>
        {selected && (
          <Stack spacing={2.5}>
            <Tabs
              value={activeKey}
              onChange={(_e, v) => setActiveKey(v)}
              variant="scrollable"
              scrollButtons="auto"
            >
              {templates.map((t) => (
                <Tab key={t.key} value={t.key} icon={<MailOutlineIcon />} iconPosition="start" label={t.name} />
              ))}
            </Tabs>

            <Stack direction={{ xs: "column", lg: "row" }} spacing={2.5} alignItems="stretch">
              {/* Editor */}
              <Card variant="outlined" sx={{ borderRadius: 3, flex: 1, minWidth: 0 }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {selected.name}
                    </Typography>
                    <Chip
                      size="small"
                      label={selected.isDefault ? "Default" : "Customised"}
                      color={selected.isDefault ? "default" : "primary"}
                      sx={{ fontWeight: 700 }}
                    />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {selected.description}
                  </Typography>

                  <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, mb: 0.75 }}>
                    Subject
                  </Typography>
                  <TextField
                    fullWidth
                    value={draft.subject}
                    onChange={(e) => setDraft((d) => ({ ...d, subject: e.target.value }))}
                    placeholder="Subject line"
                    sx={{ mb: 2 }}
                  />

                  <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, mb: 0.75 }}>
                    HTML
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    minRows={14}
                    maxRows={26}
                    value={draft.html}
                    onChange={(e) => setDraft((d) => ({ ...d, html: e.target.value }))}
                    InputProps={{
                      sx: { fontFamily: "monospace", fontSize: "0.8rem", alignItems: "flex-start" },
                    }}
                  />

                  {/* Available variables */}
                  <Box sx={{ mt: 2 }}>
                    <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, mb: 1 }}>
                      Available variables
                    </Typography>
                    <Stack direction="row" flexWrap="wrap" gap={1}>
                      {(selected.tokens || []).map((t) => (
                        <Tooltip key={t.token} title={t.description}>
                          <Chip label={t.token} size="small" variant="outlined" sx={{ fontFamily: "monospace" }} />
                        </Tooltip>
                      ))}
                    </Stack>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <LoadingButton
                      loading={save.isLoading}
                      variant="contained"
                      onClick={onSave}
                      disabled={!dirty}
                    >
                      Save changes
                    </LoadingButton>
                    <LoadingButton
                      loading={reset.isLoading}
                      variant="text"
                      color="inherit"
                      startIcon={<RestartAltIcon />}
                      onClick={onReset}
                      disabled={selected.isDefault && !dirty}
                      sx={{ color: "text.secondary" }}
                    >
                      Reset to default
                    </LoadingButton>
                    {dirty && (
                      <Typography variant="caption" color="warning.main" sx={{ fontWeight: 700 }}>
                        Unsaved changes
                      </Typography>
                    )}
                  </Stack>

                  {selected.updatedBy && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1.5 }}>
                      Last edited by {fullName(selected.updatedBy)}
                    </Typography>
                  )}
                </CardContent>
              </Card>

              {/* Live preview */}
              <Card variant="outlined" sx={{ borderRadius: 3, flex: 1, minWidth: 0 }}>
                <CardContent sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Live preview
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Subject: {fillPreview(draft.subject)}
                    </Typography>
                  </Stack>
                  <Box
                    component="iframe"
                    title="Email preview"
                    sandbox=""
                    srcDoc={fillPreview(draft.html)}
                    sx={{
                      flex: 1,
                      minHeight: 520,
                      width: "100%",
                      border: 1,
                      borderColor: "divider",
                      borderRadius: 2,
                      bgcolor: "#fff",
                    }}
                  />
                </CardContent>
              </Card>
            </Stack>
          </Stack>
        )}
      </QueryState>
    </Box>
  );
};

export default EmailTemplatesPage;
