import { Data } from "./LiveData.js";

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function getRange(elem,cluster){
  return Math.sqrt((elem.ML-cluster.avg.ML)**2+(elem.HB-cluster.avg.HB)**2+(elem.Total-cluster.avg.Total)**2)
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
centers=centers.sort((a,b)=>a.avg-b.avg)

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

export function getBestOne(num,daTa,format){
  let arr=[{err:1000}]
  const data=JSON.parse(JSON.stringify(daTa))
  if(format){
    for (let i=0;i<1000;i++){
      const res=getSpread3D(num,JSON.parse(JSON.stringify(data)))
  if (arr[0].err>res.err) arr[0]=res
    }
  }
else {
  for (let i=0;i<1000;i++){
    const res=getSpread(num,JSON.parse(JSON.stringify(data)))
if (arr[0].err>res.err) arr[0]=res
  }
}
console.log(arr[0])
  return arr[0]
}


function initClusters3D(num,data){
  let maxML=0,minML=100,maxHB=0,minHB=100,maxTotal=0,minTotal=100
  let centers=[]
data.forEach(element=>{
  element.range=100
  element.ML=typeof(element.ML)==='number'?element.ML:Number(element.ML.replace(",","."))
  element.Weight=typeof(element.Weight)==='number'?element.Weight:Number(element.Weight)
  element.HB=typeof(element.HB)==='number'?element.HB:Number(element.HB.replace(",","."))
  element.Total=typeof(element.Total)==='number'?element.Total:Number(element.Total.replace(",","."))
  if (Number(element.ML)>maxML) maxML=Number(element.ML)
  if (Number(element.ML)<minML) minML=Number(element.ML)
  if (Number(element.HB)>maxHB) maxHB=Number(element.HB)
  if (Number(element.HB)<minHB) minHB=Number(element.HB)
  if (Number(element.Total)>maxTotal) maxTotal=Number(element.Total)
  if (Number(element.Total)<minTotal) minTotal=Number(element.Total)
})
for(let i=0;i<num;i++){
centers.push({num:0,avg:{
  ML:getRandomArbitrary(minML, maxML),
HB:getRandomArbitrary(minHB, maxHB),
Total:getRandomArbitrary(minTotal, maxTotal)},acc:{
  ML:0,HB:0,Total:0
}})
}
centers=centers.sort((a,b)=>a.avg.ML-b.avg.ML)
data.forEach(element=>{
  for (let j=0;j<centers.length;j++){
    const range=getRange(element,centers[j])
    if(range<element.range) {
      element.range=range
      element.cluster=j}

    }
})
return centers
}

export function getSpread3D(num,data){
  let sumError=0,sumErrorPrev=0
  let centers=initClusters3D(num,data)
  const tries=50
  for (let i=0;i<tries;i++){
    centers.forEach(elem=>{
      elem.num=0
      elem.acc={ML:0,HB:0,Total:0}
      elem.num_leagues=0
    })
    data.forEach(element=>{
      element.range=getRange(element,centers[element.cluster])
      for (let j=0;j<centers.length;j++){
        const range=getRange(element,centers[j])
  if(range<element.range) {
    element.range=range
    element.cluster=j

  }
      }
      centers[element.cluster].num+=element.Weight || 1
      centers[element.cluster].acc.ML+=element.ML*(element.Weight || 1)
      centers[element.cluster].acc.HB+=element.HB*(element.Weight || 1)
      centers[element.cluster].acc.Total+=element.Total*(element.Weight || 1)
      centers[element.cluster].num_leagues+=1
      sumError+=element.range
    })
    centers.forEach(elem=>
      {
        elem.avg.ML=elem.acc.ML/elem.num
        elem.avg.Total=elem.acc.Total/elem.num
        elem.avg.HB=elem.acc.HB/elem.num
      })
  if (Math.abs(sumError-sumErrorPrev)<0.001){
    break
  }
    sumErrorPrev=sumError

    sumError=0
  }
  return {data,err:(sumError || sumErrorPrev),centers}
}
