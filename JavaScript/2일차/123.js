function chicken(price, num){
    this.가격=price;
    this.매운정도=3;
    this.순살=false;
    this.마리수=num;
    this.eat=function(name){
        return "치킨 "+ name + "을 먹었습니다.";
    }
}
let c1 = new chicken(10000,3);
console.log(c1.eat("황금올리브"))