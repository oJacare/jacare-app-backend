export default interface BaseUseCase<
  TUseCaseInput = unknown,
  TUseCaseOutput = unknown,
> {
  execute(input: TUseCaseInput): Promise<TUseCaseOutput>;
}
