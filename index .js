let $FILE = document.querySelector('.file');
const $CANVAS = document.querySelector('.canvas');
const $SPAN = document.querySelector('span');

//w,h Размер фото/ W,H Размер рамки для отрезания / img Загружаемая картинка
var w, h, W, H , img 
var trim = 80//Размер рамки для обрезания
var num = 6 //размер окна
window.addEventListener('load', adaptiwe)
window.addEventListener('resize', adaptiwe)
function adaptiwe() {
    if(window.innerWidth > 320) num = 4.5
    if(window.innerWidth > 620) num = 3.5
}

$FILE.addEventListener('change', async function () {
    img =  URL.createObjectURL($FILE.files[0]);
    main(img);
});

//Задает размер окна
function  createWin(w,h){
    $CANVAS.style.width = `${w}px`;
    $CANVAS.style.height = `${h}px`;
    canvas.width = w;
    canvas.height = h; 
}

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');


async function main(img) {
    //Промис закгрузки изобраения
    const city = await loadImage(img);
    //Проверка на размер картинки
    if(city.width > 1600 || city.height > 1600 || city.width < 1000  || city.height < 1000   ){
        $SPAN.style.display = 'block'; 
        $CANVAS.style.display = 'none';
    }
    else{
        //Получаем размер окна фото - num меняет размер окна
        w = city.width/num ;
        h = city.height/num ;
        W = (w/100)*trim//Размер рамки для отрезания
        H = (h/100)*trim
        
        $SPAN.style.display = 'none'; 
        $CANVAS.style.display = 'grid';

        //Задает размер окна, до обрезки
        createWin(w, h)
      
        $TRIM.style.width = `${W}px`;
        $TRIM.style.height = `${H}px`;
   
        context.drawImage(city,0 ,0, w, h);
    }
}

//Размер для фото
const $TRIM = document.querySelector('.trim');
var offsetX, offsetY;

var x = 0;
var y = 0;

const move = (e)=>{
    let offsetXx = $CANVAS.offsetWidth - $TRIM.offsetWidth//Граница правой стороны
    let offsetYy = $CANVAS.offsetHeight - $TRIM.offsetHeight//Граница левой стороны
    
    if(e.clientY <= offsetY) offsetY = e.clientY//Верх
    if(e.clientY >= offsetY + offsetYy) offsetY = e.clientY - offsetYy//Низ
    if(e.clientX <= offsetX ) offsetX = e.clientX//Лево
    if(e.clientX >= offsetX + offsetXx) offsetX = e.clientX - offsetXx//Право

    $TRIM.style.left = `${e.clientX - offsetX}px`
    $TRIM.style.top = `${e.clientY - offsetY}px`

    x = (e.clientX - offsetX) *num 
    y = (e.clientY - offsetY) *num 
}

$TRIM.addEventListener('mousedown', (e)=>{
    offsetX = e.clientX - $TRIM.offsetLeft;
    offsetY = e.clientY - $TRIM.offsetTop;
    document.addEventListener('mousemove', move);
})

document.addEventListener('mouseup', ()=>{   
    document.removeEventListener('mousemove', move);  
})

//Обрезка
$CANVAS.children[0].addEventListener('click', async function(){
    //Промис закгрузки изобраения
    const city = await loadImage(img);
    //Задает размер окна, после обрезки
    createWin(W, H)
    $TRIM.style.display = 'none'
    context.drawImage(city, x, y, w *num, h *num, 0, 0, w, h, );
    let dataURL = canvas.toDataURL("image/jpeg");
    const myImage = new Image();    
    myImage.src = dataURL
})

//Промис не работае до тех пор пока не загузится фото
//Возвращает загруженное изображение 
//Промис закгрузки изобраения
function loadImage(src) {
    return new Promise((resolve)=>{
        const image = new Image();
        image.src = src;
        image.onload = () => resolve(image);
    });
}