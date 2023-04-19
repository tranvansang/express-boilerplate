export default class ServerError extends Error {
	public override readonly name = 'ServerError'

	constructor(message: string, public status = 400) {
		super(message)
	}
}
