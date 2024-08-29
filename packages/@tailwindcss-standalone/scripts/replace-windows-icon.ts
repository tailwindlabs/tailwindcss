// @ts-ignore
import resourceHacker from '@lorki97/node-resourcehacker'

process.env['SOURCE_RESOURCE_HACKER'] = 'https://www.angusj.com/resourcehacker/resource_hacker.zip'

export async function replaceIconForBinary(path: string, iconPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    resourceHacker(
      {
        operation: 'addoverwrite',
        input: path,
        output: path,
        resource: iconPath,
        resourceType: 'ICONGROUP',
        resourceName: 'IDI_MYICON',
      },
      (err: Error) => {
        if (err) {
          reject(err)
        }
        resolve()
      },
    )
  })
}
