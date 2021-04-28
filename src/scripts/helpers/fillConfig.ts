/**
 * Generic function take 2 arguments, first is the input config, the second is the default config
 * @param {Partial<T>} config Input config, the missing config in here will be replaced by defaultConfig
 * @param {T} defaultConfig Default config
 * @returns {T} Filled config
 */
export function fillConfig<T>(config: Partial<T>, defaultConfig: T) {
  if (!config) {
    return defaultConfig;
  }
  const out: T = {} as T;
  for (let configField in defaultConfig) {
    out[configField] = config[configField] ?? defaultConfig[configField];
  }
  return out;
}
