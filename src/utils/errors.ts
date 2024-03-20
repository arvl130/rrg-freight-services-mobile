export class SignInError extends Error {
  constructor(props: {
    message: string
    statusCode: number
    canTryAgain?: boolean
  }) {
    super(props.message)
    this.name = "SignInError"
    this.statusCode = props.statusCode
    this.canTryAgain = props.canTryAgain ?? true
  }

  statusCode: number
  canTryAgain: boolean
}
