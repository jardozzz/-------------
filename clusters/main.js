import { getBestOne } from "./script.js";
import { Data as LiveData }  from "./LiveData.js";
import { prematchData } from "./Prematch_new.js";
import { pregame_old } from "./pregame_old.js";
import { live_old } from "./lv_old.js";
import { weighted_pregame } from "./pregame_weighted.js";
import { pregame_old_weighted } from "./pregame_old_weighted.js";
import { live_weighted } from "./live_weighted.js";
import { live_weighted_old } from "./live_weighted_old.js";
import { convert } from "./csvConverter.js";
import { exportCSVFile,headers } from "./jsonToCSV.js";

const elems=document.getElementsByClassName('count')
const noweight=document.getElementById('NOT')
const Weight=document.getElementById('ARE')
const Natasha=document.getElementById('NATASHA')
const drop=document.getElementById('drop_zone')
const esports=document.getElementById('ESPORTS')
const esports_section=document.getElementsByClassName('section')
const file_drop=document.getElementById('dropZone')
const file_section=document.getElementsByClassName('drop_wrapper')
const download=document.getElementById('DOWNLOAD')

let dataToClusterise

download.addEventListener('click',()=>{
 esports.checked? getFullData(dataToClusterise):getFullData(dataToClusterise,'3D')})
function hide(){
if (esports.checked) {
  dataToClusterise=null
  esports_section[0].style.display="block"
file_section[0].style.display="none"}
else{
  dataToClusterise=null
  esports_section[0].style.display="none"
file_section[0].style.display="block"
}
}

hide()
esports.addEventListener('click',hide)
file_drop.addEventListener('click',hide)
drop.addEventListener('dragover',dragOverHandler)
drop.addEventListener('drop',dropHandler)
function addListenersToEsports(){
Array.from(elems).forEach(function(elem) {
  elem.addEventListener('click',()=>{
    if (noweight.checked && esports.checked){

    if (elem.dataset.type==="LIVE"){
      dataToClusterise=LiveData
    }

    else if (elem.dataset.type==="pregame"){
      dataToClusterise=prematchData
    }

    else if(elem.dataset.type==="LIVE_old"){
      dataToClusterise=live_old
    }

    else if(elem.dataset.type==="pregame_old"){
      dataToClusterise=pregame_old
    }

  }
  else if (Weight.checked && esports.checked){
    if (elem.dataset.type==="LIVE"){
      dataToClusterise=live_weighted

    }
    else if (elem.dataset.type==="pregame"){
      dataToClusterise=weighted_pregame

    }
    else if(elem.dataset.type==="LIVE_old"){
      dataToClusterise=live_weighted_old

    }
    else if(elem.dataset.type==="pregame_old"){
      dataToClusterise=pregame_old_weighted

    }
  }
  const res=esports.checked?getBestOne(Number(elem.dataset.count),dataToClusterise):getBestOne(Number(elem.dataset.count),dataToClusterise,'3D')
  showResult(res)
  })
})
}

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
  const ML=data.centers[Number(element.dataset.index)].avg?.ML?.toFixed(3) || data.centers[Number(element.dataset.index)].avg.toFixed(3)
  const HB=data.centers[Number(element.dataset.index)].avg?.HB?.toFixed(3)  || ""
  const Total=data.centers[Number(element.dataset.index)].avg?.Total?.toFixed(3) || ""
  const heading=document.createElement('div')
  heading.classList.add('cluster_header')
  heading.innerHTML=`Cluster number ${element.dataset.index}.Margin WIN=${ML} HB=${HB} TOTAL=${Total}`
  const num=document.createElement('div')
  num.classList.add('cluster_header')
  num.innerHTML=`NUMBER OF LEAGUES IN CLUSTER IS ${data.centers[Number(element.dataset.index)].num_leagues}`
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

async function dropHandler(ev){
ev.preventDefault()
let endData={}

  // Use DataTransferItemList interface to access the file(s)
  await Promise.allSettled([...ev.dataTransfer.items].map(async (item, i) => {
    // If dropped items aren't files, reject them
   return new Promise((resolve,reject)=>{ if (item.kind === 'file') {
           const file = item.getAsFile();
           const reader=new FileReader()
           reader.readAsText(file)
           reader.onload=()=>{

            dataToClusterise=convert(reader.result)
            resolve(endData)}


    }
  })

  }))

return endData
}
function dragOverHandler(ev) {

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
}

function getFullData(LeagueToClusterise,param){
  const min=2,max=9
  if (!LeagueToClusterise) {
    alert('no data to clusterise')
    return
  }

  let LeaguesResult=[],centersResult=[]
  for (const i of LeagueToClusterise){
    LeaguesResult.push({name:i.Name})
  }
  for (let i=min;i<max;i++){
    let data=JSON.parse(JSON.stringify(LeagueToClusterise))
    const midResult=param?getBestOne(i,data,'3D'):getBestOne(i,data)
    console.log(midResult)
for (let j=0;j<midResult.data.length;j++ ){
  LeaguesResult[j][`Cluster${i}`]=midResult.data[j].cluster
}
for(let j=0;j<midResult.centers.length;j++){
  centersResult.push({type:`${i}Clusters`,ML:midResult.centers[j].avg.ML || midResult.centers[j].avg,HB:midResult.centers[j].avg.HB,total:midResult.centers[j].avg.Total})

}
  }
  const LeagueHeaders=['Name','Cluster2','Cluster3','Cluster4','Cluster5','Cluster6','Cluster7','Cluster8']
  const centersHeaders=['type','ML','HB','total']
exportCSVFile(LeagueHeaders,LeaguesResult,'Leagues')
exportCSVFile(centersHeaders,centersResult,'Cluster Centers')
}
addListenersToEsports()
