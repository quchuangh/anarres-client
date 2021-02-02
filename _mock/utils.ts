import addDays from 'date-fns/addDays';
import format from 'date-fns/format';
import { Random } from 'mockjs';

export const COLOR_NAMES = ['red', 'volcano', 'orange', 'gold', 'yellow', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple', 'magenta'];

export function genName(): any {
  return genArr(['asdf', 'cipchk', '卡色']);
}

export function genProvince(): any {
  return genArr([
    '台湾',
    '河北',
    '山西',
    '内蒙古',
    '辽宁',
    '吉林',
    '黑龙江',
    '江苏',
    '浙江',
    '安徽',
    '福建',
    '江西',
    '山东',
    '河南',
    '湖北',
    '湖南',
    '广东',
    '广西',
    '海南',
    '四川',
    '贵州',
    '云南',
    '西藏',
    '陕西',
    '甘肃',
    '青海',
    '宁夏',
    '新疆',
    '北京',
    '天津',
    '上海',
    '重庆',
    '香港',
    '澳门',
  ]);
}

export function genArr(arr: any[], count: number = 1): any {
  if (count === 1) {
    return arr[Random.natural(0, arr.length - 1)];
  }
  return new Array(count <= -1 ? Random.natural(0, -count) : count).fill({}).map(() => {
    return arr[Random.natural(0, arr.length - 1)];
  });
}

export function genColorName(): any {
  return genArr(COLOR_NAMES);
}

export function genLabel(): any {
  return genArr([
    {
      color: 'green',
      text: 'Clients',
    },
    {
      color: 'red',
      text: 'Important',
    },
    {
      color: 'blue',
      text: 'Other',
    },
  ]);
}

/** 生成头像，`id` 只能0-8 */
export function genMp(id?: number): string {
  return `https://randomuser.me/api/portraits/lego/${typeof id === 'undefined' ? Random.natural(0, 8) : id}.jpg`;
}

export function genBigMp(): string {
  return `./assets/tmp/img-big/${Random.natural(1, 8)}.jpg`;
}

export function genTag(num: number = -3): any {
  return genArr(['Angular', 'Node', 'HTML5', 'Less', 'Db', 'Python', 'Go'], num);
}

export function addDate(days: number): Date {
  return addDays(new Date(), days);
}

export function genData(days: number, dateFormat: string = 'yyyy-MM-dd'): string {
  return format(addDate(days), dateFormat);
}

export function rudeCopy(obj: any): string {
  return JSON.parse(JSON.stringify(obj));
}

export function genContent(): string {
  return `
  <h2>主标题</h2>
  <h3>次标题</h3>
  <p><a>段落</a>，${Random.cparagraph(1, 1)}<p>
  <p>段落，${Random.paragraph(1, 1)}<p>
  <h2>列表</h2>
  <ol>
    <li>
      <p>段落，${Random.paragraph(1, 1)}<p>
      <ul>
        <li><a>${Random.ctitle(5, 10)}</a></li>
        <li><a>${Random.ctitle(5, 10)}</a></li>
        <li><a>${Random.ctitle(5, 10)}</a></li>
        <li><a>${Random.ctitle(5, 10)}</a></li>
        <li><a>${Random.ctitle(5, 10)}</a></li>
      </ul>
    </li>
    <li>
      <p>段落，${Random.paragraph(1, 1)}<p>
    </li>
    <li>
      <p>段落，${Random.paragraph(1, 1)}<p>
    </li>
  </ol>
  <h2>图像</h2>
  <p><img src="${Random.image()}"></p>
  <h2>表格</h2>
  <table>
    <thead>
      <tr>
        <th>列</th>
        <th>列</th>
        <th>列</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>列</td>
        <td>列</td>
        <td>列</td>
      </tr>
      <tr>
        <td>列</td>
        <td>列</td>
        <td>列</td>
      </tr>
      <tr>
        <td>列</td>
        <td>列</td>
        <td>列</td>
      </tr>
    </tbody>
  </table>
  `;
}
