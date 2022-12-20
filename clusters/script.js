import { Data } from "./LiveData.js";

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
function initClusters(num,data){

  let max=0,min=100
  let centers=[]
data.forEach(element=>{
  element.range=100
  element.ML=typeof(element.ML)==='number'?element.ML:Number(element.ML.replace(",","."))
  element.Weight=typeof(element.Weight)==='number'?element.Weight:Number(element.Weight)
  if (Number(element.ML)>max) max=Number(element.ML)
  if (Number(element.ML)<min) min=Number(element.ML)
})
for(let i=0;i<num;i++){
centers.push({num:0,avg:getRandomArbitrary(min, max),acc:0})
}

data.forEach(element=>{
  for (let j=0;j<centers.length;j++){
    if(Math.abs(element.ML-centers[j].avg)<element.range) {
      element.range=Math.abs(element.ML-centers[j].avg)
      element.cluster=j}

    }


})
return centers
}

function getSpread(num,data){
  let sumError=0,sumErrorPrev=0
let centers=initClusters(num,data)
console.log(data)
const tries=50
for (let i=0;i<tries;i++){
  centers.forEach(elem=>{
    elem.num=0
    elem.acc=0
    elem.num_leagues=0
  })
  data.forEach(element=>{
    element.range=Math.abs(element.ML-centers[element.cluster].avg)
    for (let j=0;j<centers.length;j++){
if(Math.abs(element.ML-centers[j].avg)<element.range) {
  element.range=Math.abs(element.ML-centers[j].avg)
  element.cluster=j

}
    }
    centers[element.cluster].num+=element.Weight || 1
    centers[element.cluster].acc+=element.ML*(element.Weight || 1)
    centers[element.cluster].num_leagues+=1
    sumError+=element.range
  })
  centers.forEach(elem=>elem.avg=elem.acc/elem.num)
if (Math.abs(sumError-sumErrorPrev)<0.001){
  break
}
  sumErrorPrev=sumError

  sumError=0
}
return {data,err:(sumError || sumErrorPrev),centers}
}
export function getBestOne(num,daTa){
  let arr=[{err:1000}]
  for (let i=0;i<100;i++){
    const res=getSpread(num,JSON.parse(JSON.stringify(daTa)))
if (arr[0].err>res.err) arr[0]=res
  }
  console.log(arr[0])
  return arr[0]
}
