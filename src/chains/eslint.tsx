import { OpenAI } from "langchain/llms"

export type EslintResult =
  | {
      status: "solution"
      solution: string
    }
  | {
      status: "no-solution"
    }

// delays for n ms
export const delay = (n: number) => new Promise((res) => setTimeout(res, n))

// Chains used to solve Eslint problems
export async function openAI(): Promise<EslintResult> {
  await delay(2_000)
  return { status: "no-solution" }
}

export async function alpaca(): Promise<EslintResult> {
  await delay(2_000)
  return { status: "no-solution" }
}

export async function codealpaca(): Promise<EslintResult> {
  await delay(2_000)
  return { status: "no-solution" }
}
