import React from 'react';

export default ({ currentPage, lastPage, hasNextPage, hasPreviousPage, classes, pageHandler, lastPageHandler, nextPageHandler, prevPageHandler }) => {
// initial variables
  let list=[]
  let pageNum;
  let neighbor = 5;
  let totalPage = lastPage;


  if(totalPage>=(neighbor*2)){
    pageNum = pagesContainer(currentPage,totalPage,neighbor)
  }else{
    pageNum = range(1,totalPage)
  }

  pageNum.map(pg=>{
    let classArray = classes.pageList;
    if(pg === currentPage){
      classArray = [classes.pageList,classes.active].join(' ')
    }
    return list.push(
      <li 
        key={Math.random()*pg} 
        className={classArray} 
        onClick={()=>pageHandler(pg)}>
        {pg}
      </li>
    )
  })
  
  if (hasNextPage) {
    //   nextPageHandler  --> (currentPage+1)
    list.push(
        <li
            key={Math.random()*currentPage}
            className={classes.nextPage}
            onClick={(e)=>nextPageHandler(e)}>
            Next
        </li>
    )
  }
  //check for last Page
  if (currentPage !== lastPage && !pageNum.find(e => e === lastPage)) {
    list.push(
        <li 
            key ={Math.random()*lastPage} 
            className={classes.lastPage}
            onClick={()=>lastPageHandler()}>
            Last[{lastPage}]
        </li>
    )
  }

  if (hasPreviousPage) {
    //   nextPageHandler  --> (currentPage-1)
    list.unshift(
      <li 
        key={Math.random()/currentPage}  
        className={classes.previousPage}
        onClick={()=>prevPageHandler()}>
        Prev
      </li>
    )
  }
  return list;
}

function range(from, to, step = 1){
  let i = from;
  if(i===0){ i=1 }
  const range = [];
  while (i <= to) {
    range.push(i);
    i += step;
  }
  return range;
}

function pagesContainer(currentPage= 1,totalPage=1,neighbor = 5){
    currentPage = (typeof(currentPage) === 'number' && currentPage > 0 ) ? currentPage : 1;
    totalPage   = (typeof(totalPage) === 'number' && totalPage > 0 ) ? totalPage : 1;
    neighbor    = (typeof(neighbor) === 'number' && neighbor > 0 ) ? neighbor : 5;
    let startPoint;
    let endPoint;
    /* test :totalPage=100  , neighbor=5 */
    // pages lower than neighbor_5
    if(currentPage<neighbor){
      startPoint = 1
      return range(startPoint,neighbor*2)
    }
     // pages >= 100 || pages > 95
    if(currentPage>=totalPage || currentPage>(totalPage-neighbor)){
      startPoint  = totalPage -  neighbor*2
      endPoint    = startPoint + neighbor*2
      return range(startPoint,endPoint);
    }
    // pages > 5 and pages < 100
    if(currentPage>=neighbor&& currentPage<totalPage){ 
      startPoint  = currentPage - neighbor;
      endPoint    = currentPage  + neighbor
      return range(startPoint,endPoint);
    }
}
