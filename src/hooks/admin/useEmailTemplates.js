import { useMutation, useQuery, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import {
  fetchEmailTemplates,
  updateEmailTemplate,
  resetEmailTemplate,
} from "../../api/admin/admin-api";

const KEY = "email-templates";

const errorMessage = (error) =>
  error?.response?.data?.message || "Something went wrong";

export const useEmailTemplates = (options = {}) =>
  useQuery([KEY], fetchEmailTemplates, options);

export const useEmailTemplateMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(updateEmailTemplate, {
    onSuccess: () => {
      queryClient.invalidateQueries(KEY);
      toast.success("Template saved");
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
};

export const useEmailTemplateReset = () => {
  const queryClient = useQueryClient();
  return useMutation(resetEmailTemplate, {
    onSuccess: () => {
      queryClient.invalidateQueries(KEY);
      toast.success("Template reset to default");
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
};
