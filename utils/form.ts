import { UpdateCommunity } from "@/models/Community";

export const handleFormData = (
  key: string,
  formData: UpdateCommunity,
  form: FormData
) => {
  const formKey: keyof UpdateCommunity = key as keyof UpdateCommunity;
  if (formKey !== "banner") {
    form.set(key, String(formData[formKey]));
  }
};
