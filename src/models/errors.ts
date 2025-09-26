export class MissingAccessCodeError extends Error {
  constructor(message?: string) {
    super(message || "Missing access code");
    this.name = "MissingAccessCodeError";
  }
}
