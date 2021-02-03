import {DatePipe, formatCurrency} from '@angular/common';


/**
 * 根据指定的间隔天数和最后时间,返回一个时间区间数组
 * @param day 间隔天数
 * @param endDate 最后时间
 */
export function getDayRange(day: number, endDate: (() => Date) | Date = () => new Date()): Array<Date> {
  const end = typeof endDate === 'function' ? endDate() : endDate;
  end.setHours(23, 59, 59, 999);
  const begin = new Date(end.getTime() - 1000 * 60 * 60 * 24 * (day - 1));
  begin.setHours(0, 0, 0, 0);
  return [begin, end];
}

/**
 * 转换枚举为Object
 */
export function enumToObject(enumObject: any): any {
  return Object.keys(enumObject)
    .map(k => {
      const value = enumObject[k];
      return {[value]: k};
    }).reduce((previousValue, currentValue) => Object.assign(previousValue, currentValue), {});
}

/**
 * 输出类型为{label:string,value:number
 */
export function enumToSelectEnum(enumObject: any): Array<{ label: string, value: number }> {
  return Object.keys(enumObject)
    .filter(item => typeof enumObject[item] !== 'number')
    .map(k => {
      const value = enumObject[k] as string;
      return {label: value, value: parseInt(k, 10)};
    });
}

export function enumGetLabel(enumObject: any, key: any): any {
  return enumToObject(enumObject)[key] || key;
}

/**
 *
 * @param date Date
 * @param format string
 */
export function dateToString(date: Date, format: string = 'yyyy-MM-dd HH:mm:ss'): string | null {
  return new DatePipe('zh_CN').transform(date, format);
}


/**
 * 防xss,转译标签
 * @param unsafe 不安全内容
 */
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * 对象转换为post body参数字符串
 * @param params 原始参数对象
 * @param timestamp 对于时间是否转换为时间戳,或根据传入时间格式转换
 * @param removeEmpty 是否移除空参数
 */
export function encodeParams(params: { [key: string]: any | any[] } = {},
                             {timestamp, removeEmpty}: { timestamp?: true | string, removeEmpty: boolean } = {
                               timestamp: true,
                               removeEmpty: true
                             }): string {
  const paramsString: any[] = [];
  const _params = transformParams(params, timestamp, removeEmpty);
  Object.keys(_params).forEach(key => {
    const value = params[key];
    key = encodePlus(key);
    paramsString.push(`${key}=${encodePlus(value)}`);
  });
  return paramsString.join('&');
}


/**
 * 转换查询参数
 * 去掉空参数,转换时间格式,去掉字符串前后空格
 * @param params 参数
 * @param timestamp 对于时间是否转换为时间戳,或根据传入时间格式转换
 * @param removeEmpty 是否移除空参数
 */
export function transformParams(params: any = {}, timestamp: string | true = 'yyyy-MM-dd HH:mm:ss', removeEmpty: boolean = true): any {
  params = Object.assign({}, params);
  return Object.keys(params).map(key => {
    let value = params[key];
    if (removeEmpty) {
      if (value === null || value === undefined || (typeof value === 'string' && !value.trim()) || (Array.isArray(value) && !value.length)) {
        return null;
      }
    }
    if (value instanceof Date) {
      if (timestamp === true) {
        value = value.getTime();
      } else {
        value = dateToString(value, timestamp);
      }
    } else if (typeof value === 'string') {
      value = value.trim();
    }
    return {[key]: value};
  })
    .filter(v => !!v)
    .reduce(((previousValue, currentValue) => Object.assign(previousValue, currentValue)), {});
}


/**
 * angular 根据http标准未对+做转译,但是后端框架不认识+,故此转译一次
 * @param value 待转译的值
 */
function encodePlus(value: string = ''): any {
  return value.replace(/\+/gi, '%2B');
}


/**
 * 根据数组构造一个tree结构的数组
 * @param data 原始数据
 * @param children 子节点名称
 * @param parentId 父级字段
 * @param id   组件ID
 */

export function buildTreeData(data: Array<any>, {children, parentId, id}:
  { children?: string, parentId?: string, id?: string } =
  {
    children: 'children',
    parentId: 'parentId',
    id: 'id'
  }): Array<any> {

  data = data.map(item => {
    return {...item, isLeaf: !data.some(_item => _item.parentId === item.id)};
  });

  const parentGroupMap = new Map<string, Array<any>>();
  data.forEach(item => {
    // @ts-ignore
    const key = item[parentId] || 'root';
    let items = parentGroupMap.has(key) ? [item].concat(parentGroupMap.get(key)) : [item];
    items = items.sort(((a, b) => (a.sort || 0) - (b.sort || 0)));

    parentGroupMap.set(key, items);
  });
  const result: any[] = [];
  data.forEach(item => {
    // @ts-ignore
    if (parentGroupMap.has(item[id])) {
      // @ts-ignore
      item[children] = parentGroupMap.get(item[id]);
    }
    // @ts-ignore
    if (item[parentId] !== null
      // @ts-ignore
      && item[parentId] !== undefined
      // @ts-ignore
      && item[parentId] !== 0
      // @ts-ignore
      && data.some(i => i.id === item[parentId])) {
      return;
    }
    result.push(item);
  });
  return result;
}



/**
 * 拷贝增量对象
 * @param original 原始对象
 * @param target 变更后的对象
 * @return 有变更返回变更内容,无变更返回false
 */
export function incrementalObject(original: any, target: any): any | false {

  const keys = Object.keys(target).filter(key => {
    const value = target[key];
    return !original[key] || original[key] !== value;
  });
  if (!keys.length) {
    return false;
  }
  const newObject = {};
  keys.forEach(key => {
    // @ts-ignore
    newObject[key] = target[key];
  });
  return newObject;
}


/**
 * 数组分片
 * @param items 数组列表
 * @param size 拆分大小
 */
export function arrayPartition<T>(items: Array<T>, size: number = 3): Array<Array<T>> {
  return items.reduce(((previousValue, currentValue) => {
    // @ts-ignore
    !previousValue.length || previousValue[previousValue.length - 1].length === size ? previousValue.push([currentValue]) :
      // @ts-ignore
      previousValue[previousValue.length - 1].push(currentValue);
    return previousValue;
  }), []);

}


/**
 * 生成 (min)-(max)的随机数
 */
export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * 为 keys中key在data中的求和 结果四舍五入,保留两位小数
 * @param data 数据
 * @param keys 键
 * @param currency 是否转换为货币模式
 */
export function sum(data: Array<{ [key: string]: any }>, keys: Array<string>, currency: boolean = true): { [key: string]: number | string | null } {
  const result = data.reduce(((previousValue, currentValue) => {
    Object.keys(currentValue).filter(key => keys.indexOf(key) >= 0)
      .map(key => {
        let current = parseFloat(currentValue[key]);
        current = Number.isNaN(current) ? 0 : current;
        const previous = previousValue[key] || 0;
        previousValue[key] = previous + current;
      });
    return previousValue;
  }), {});
  Object.keys(result).forEach(key => {
    if (Number.isNaN(result[key])) {
      result[key] = null;
    } else if (currency) {
      result[key] = formatCurrency(parseFloat(result[key].toFixed(2)), 'zh_CN', '', 'CNY');

    } else {
      result[key] = parseFloat(result[key].toFixed(2));
    }

  });
  return result;

}


