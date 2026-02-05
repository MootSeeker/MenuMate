/**
 * Generic Zod Resolver for React Hook Form
 *
 * This custom resolver bridges Zod v4 schema validation with React Hook Form.
 * It can be used with any Zod schema across the application.
 *
 * @example
 * ```tsx
 * import { zodResolver } from '@/features/auth/utils/zodResolver';
 * import { z } from 'zod';
 *
 * const schema = z.object({
 *   email: z.string().email(),
 *   password: z.string().min(8),
 * });
 *
 * const { control } = useForm({
 *   resolver: zodResolver(schema),
 * });
 * ```
 */

import { z } from 'zod';

/**
 * Converts Zod validation schema to React Hook Form resolver
 *
 * @param schema - Zod schema to validate against
 * @returns React Hook Form compatible resolver function
 */
export function zodResolver<TSchema extends z.ZodTypeAny>(schema: TSchema) {
  return async (data: unknown) => {
    const result = schema.safeParse(data);

    if (result.success) {
      return { values: result.data as z.infer<TSchema>, errors: {} };
    }

    // Transform Zod errors to React Hook Form format
    const errors: Record<string, { type: string; message: string }> = {};
    for (const issue of result.error.issues) {
      const path = issue.path.join('.');
      if (!errors[path]) {
        errors[path] = {
          type: issue.code,
          message: issue.message,
        };
      }
    }

    return { values: {}, errors };
  };
}
