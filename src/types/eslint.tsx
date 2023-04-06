export type EslintFix = {
  range: [number, number]
  text: string
}

export type EslintMessage = {
  column: number
  endColumn: number
  line: number
  endLine?: number
  message: string
  messageId: string
  nodeType: string
  ruleId: string
  severity: number
  fix: EslintFix
}

export type EslintFile = {
  filePath: string
  errorCount: number
  fatalErrorCount: number
  fixableErrorCount: number
  FixableWarningCount: number
  messages: EslintMessage[]
  suppressedMessages: EslintMessage[]
  usedDeprecatedRules: EslintMessage[]
  warningCount: number
}
