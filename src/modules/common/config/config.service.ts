import { Injectable } from '@nestjs/common'
import { loadEnv } from '@mullerstd/load-env/dist/loadEnv'

@Injectable()
export class ConfigService {
  private readonly envConfig: NodeJS.ProcessEnv

  constructor() {
    this.envConfig = loadEnv()
  }

  get(key: string): string {
    return this.envConfig[key] as string
  }
}
