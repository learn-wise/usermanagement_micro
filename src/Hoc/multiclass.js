export default function cl(ele = [],classes) {
    let arr = []
    ele.map(el => arr.push(classes[el]))
    return arr.join(' ')
}