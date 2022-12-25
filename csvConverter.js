export function convert(str){
  let result=[]
  const arr=str.split('\r\n')
  const headers=arr[0].split(",")
  for(let i=1;i<arr.length-1;i++){

    let delimeter='QWERZ^'
    let acc='',flag=false,res={}
    for (let j of arr[i]){
      if (j==='"' && !flag) flag=true
      else if (j==='"' && flag) flag=false
      else if (j==="," && !flag) acc+=delimeter
      else acc+=j
    }
    console.log(acc)
    let temp=acc.split(delimeter)
    for (let j=0;j<headers.length;j++){
      res[headers[j]]=temp[j]
    }
    result.push(res)
  }
  return result
}
