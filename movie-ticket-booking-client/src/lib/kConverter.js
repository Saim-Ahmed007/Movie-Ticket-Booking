export const kConverter = (num) => {
    if(num >= 1000){
        return (num / 10000).toFixed(1) + 'k'
    }else{
        return num
    }
}