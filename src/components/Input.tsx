import { useGetResponsiveDeckState } from "@/hooks/global/globalState";
import { normalizeLooseUrl } from "@/utils/inputValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  url: z.string().transform((value, ctx) => {
    try {
      return normalizeLooseUrl(value);
    } catch (error) {
      ctx.addIssue({
        code: "custom",
        message:
          error instanceof Error ? error.message : "Please enter a valid URL",
      });
      return z.NEVER;
    }
  }),
});

type FormSchema = z.infer<typeof formSchema>;

export function Input() {
  const updateIsUrlValid = useGetResponsiveDeckState(
    (state) => state.updateIsUrlValid,
  );
  const updateUrl = useGetResponsiveDeckState((state) => state.updateUrl);
  const inputValue = useGetResponsiveDeckState((state) => state.url);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      url: inputValue || "",
    },
  });

  useEffect(() => {
    reset({ url: inputValue || "" });
  }, [inputValue, reset]);

  const onSubmit = handleSubmit(async (data: FormSchema) => {
    updateIsUrlValid(true);
    updateUrl(data.url);

    // Set to browser extension's storage
    await browser.storage.local.set({
      [`${EXTENSION_VARIABLES.STORAGE_KEY}`]: data.url,
    });
  });

  return (
    <form onSubmit={onSubmit} className="h-auto">
      <input
        className={`w-full py-1 px-4 font-pt-sans text-black bg-white text-base outline-none rounded-3xl focus:ring-2 focus:ring-primary transition-colors duration-200`}
        placeholder="place your url here"
        {...register("url")}
      />

      {errors.url && (
        <p className="mt-2 text-sm text-red-500">{errors.url.message}</p>
      )}
    </form>
  );
}
