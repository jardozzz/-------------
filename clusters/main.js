import { getBestOne } from "./script.js";
import { Data as LiveData }  from "./LiveData.js";
import { prematchData } from "./Prematch_new.js";
const elems=document.getElementsByClassName('count')
console.log(elems)
Array.from(elems).forEach(function(elem) {
  elem.addEventListener('click',()=>{
    if (elem.dataset.type==="LIVE"){
      const res=getBestOne(Number(elem.dataset.count),LiveData)
      showResult(res)
    }
    else {
      const res=getBestOne(Number(elem.dataset.count),prematchData)
      showResult(res)
    }
  })
})
function showResult(data){

  const container=document.getElementsByClassName('leagues')[0]

  container.innerHTML=""
  const err=document.querySelector('.ERROR_BLOCK')
  err.innerHTML=`SUMMARY ERROR IS ${Number(data.err).toFixed(2)}`
  data.centers.forEach((elem,index)=>{

    const cluster=document.createElement('div')
    cluster.classList.add(`row`)
cluster.dataset.index=index
container.appendChild(cluster)
  })
 const rows= document.getElementsByClassName('row')
 Array.from(rows).forEach((element)=>{
  const heading=document.createElement('div')
  heading.classList.add('cluster_header')
  heading.innerHTML=`Cluster number ${element.dataset.index}.Margin=${data.centers[Number(element.dataset.index)].avg.toFixed(3)}`
  const num=document.createElement('div')
  num.classList.add('cluster_header')
  num.innerHTML=`NUMBER OF LEAGUES IN CLUSTER IS ${data.centers[Number(element.dataset.index)].num}`
  element.appendChild(heading)
  element.appendChild(num)
  const tournaments=data.data.filter(elem=>elem.cluster===Number(element.dataset.index))
  tournaments.forEach(elem=>{
    const tournament=document.createElement('div')
tournament.innerHTML=elem.Name
element.appendChild(tournament)
  })
 })
}
