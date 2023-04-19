import {ZodType} from 'zod'
import ServerError from './ServerError'

export const parseZodSchema = <Output, Payload>(
	schema: ZodType<Output>,
	payload: Payload
): Output => {
	const parsed = schema.safeParse(payload)
	if (parsed.success) return parsed.data
	// loggerContext.value.info('invalid data when parsing with zod', pick(parsed.error, 'issues'))
	throw new ServerError(`invalid value at ${parsed.error.issues[0]?.path.join(',') ?? 'undefined'}: ${parsed.error.issues[0]?.message ?? 'undefined'}`, 400)
}
