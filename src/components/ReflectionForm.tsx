"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { generateReflectionAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import type { GenerateReflectionOutput } from "@/ai/flows/generate-reflection";
import type { Temperament, SoulStage } from "@/lib/types";

const formSchema = z.object({
  innerState: z
    .string()
    .min(10, { message: "Please share a little more about your inner state." })
    .max(1000),
  temperament: z.enum(
    ["Sanguine", "Choleric", "Melancholic", "Phlegmatic"],
    { required_error: "Please select your temperament." }
  ),
  soulStage: z.enum(["nafs al-ammarah", "lawwamah", "mutma’innah"], {
    required_error: "Please select your estimated soul stage.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface ReflectionFormProps {
  onReflectionGenerated: (
    data: GenerateReflectionOutput,
    temperament: Temperament,
    soulStage: SoulStage
  ) => void;
  onLoading: (loading: boolean) => void;
}

export function ReflectionForm({
  onReflectionGenerated,
  onLoading,
}: ReflectionFormProps) {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      innerState: "",
    },
  });

  async function onSubmit(values: FormValues) {
    onLoading(true);
    try {
      const result = await generateReflectionAction(values);
      onReflectionGenerated(
        result,
        values.temperament as Temperament,
        values.soulStage as SoulStage
      );
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description:
          "Could not generate reflection. Please try again later.",
      });
      onLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mt-8 text-left">
      <p className="mb-8 text-center text-muted-foreground text-lg">
        Present your inner state. What conflict, regret, question, or contradiction is on your heart?
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="innerState"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Inner State</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write here..."
                    className="resize-none"
                    rows={6}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="temperament"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temperament</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a temperament" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Sanguine">Sanguine (Air)</SelectItem>
                      <SelectItem value="Choleric">Choleric (Fire)</SelectItem>
                      <SelectItem value="Melancholic">Melancholic (Earth)</SelectItem>
                      <SelectItem value="Phlegmatic">Phlegmatic (Water)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="soulStage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Nafs (Soul) Stage</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a soul stage" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="nafs al-ammarah">
                        Nafs al-Ammarah (The Commanding Soul)
                      </SelectItem>
                      <SelectItem value="lawwamah">
                        Nafs al-Lawwamah (The Blaming Soul)
                      </SelectItem>
                      <SelectItem value="mutma’innah">
                        Nafs al-Mutma’innah (The Soul at Peace)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full font-headline tracking-wider"
            disabled={form.formState.isSubmitting}
          >
            Seek Reflection
          </Button>
        </form>
      </Form>
    </div>
  );
}
