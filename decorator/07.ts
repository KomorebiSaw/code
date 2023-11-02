// 参数装饰器

// 参数格式化配置
const parseConf: ((...args: any[]) => any)[] = []

export const parse = (parseTo: (...args: any[]) => any) => (target: any, propertyName: string, index: number) => {
  parseConf[index] = parseTo
}

// 在函数调用前执行格式化操作
export const parseDecorator = (target: any, propertyName: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
  console.log('开始格式化数据')
  return {
    ...descriptor,
    value(...args: any[]) {
      // 获取格式化后的参数列表
      const newArgs = args.map((v, i) => (parseConf[i] ? parseConf[i](v) : v))
      console.log('格式化完毕')
      return descriptor.value.apply(this, newArgs)
    },
  }
}

export interface UserType {
  id: number
  username: string
}

class UserService {
  private users: UserType[] = [
    { id: 1, username: 'admin' },
    { id: 2, username: 'superadmin' },
  ]

  getUsers() {
    return this.users
  }

  @parseDecorator
  delete(@parse((arg: any) => Number(arg)) id: number) {
    this.users = this.users.filter((userObj) => userObj.id !== id)
    return this
  }
}

export const exp78 = () => {
  console.log()
  console.log('-----------------------示例7:参数装饰器-----------------------')
  console.log('-----------------------格式化参数-----------------------')
  console.log()
  const userService = new UserService()
  userService.delete(1)
  console.log(userService.getUsers())
  console.log()
  console.log('-----------------------示例7:执行完毕-----------------------')
}

// 控制台输出: [ { id: 2, username: 'superadmin' } ]
