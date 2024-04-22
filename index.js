
function convertToSVG(img) {
    const canvas=document.createElement('canvas')
    const ctx=canvas.getContext("2d")

    const ar=img.naturalWidth/img.naturalHeight

    canvas.width=window.innerWidth
    canvas.height=window.innerWidth/ar

    ctx.drawImage(img,0,0,canvas.width,canvas.height)

    const data=ctx.getImageData(0,0,canvas.width,canvas.height)

    ctx.clearRect(0,0,canvas.width,canvas.height)

    const g=10
    const s=5

    let svg=`<svg viewBox="0 0 ${canvas.width} ${canvas.height}" xmlns="http://www.w3.org/2000/svg">`

    ctx.fillStyle='red'

    for(let i=0;i<canvas.width;i+=g){
        for(let j=0;j<canvas.height;j+=g){
            const k=(j*canvas.width+i)*4
            const [r,g,b,a]=data.data.slice(k,k+4)
            
            const avg=(r+g+b)/3

            const ts=(1-avg/255)*s
            
            // if(avg<128){
                // ctx.beginPath()
                // ctx.arc(i,j,s,0,2*Math.PI)
                // ctx.fill()

                svg+=`<circle cx="${i}" cy="${j}" r="${ts}" />`
            // }

        }
    }

    svg+=`</svg>`

    return svg;
}


function downloadSVG(svg) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(svg));
    element.setAttribute('download', 'dot.svg');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}
;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    document.addEventListener(eventName, preventDefaults, false)
  })
  
  function preventDefaults (e) {
    e.preventDefault()
    e.stopPropagation()
  }

document.addEventListener('drop',(e) => {
    e.preventDefault();

    //TODO: drop files is async 

    console.log(e.dataTransfer.files.length);
    


    if (e.dataTransfer.files.length === 1) {
        const fr = new FileReader();

        fr.onload = () => {
            const img=new Image;

            img.onload=()=>{
                downloadSVG(convertToSVG(img));
            };

            img.src=fr.result
        };

        fr.readAsDataURL(e.dataTransfer.files[0]);
    }
},false)