export class BaseTransformer {
    static transform(datas: Array<any>, additionalArg?: any | any) {
        const array = []
        datas.map((data: any) => {
            array.push(this.singleTransform(data, additionalArg))
        })
        return array
    }

    static singleTransform(datas: any, additionalArguments?: any | any) {}
}