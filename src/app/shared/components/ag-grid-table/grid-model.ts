export interface IPage<T> {
  /** 数据 */
  records: T[];
  /** 总条数 */
  total: number;
  /** 页大小 */
  size: number;
  /** 当前页码 */
  current: number;
}
