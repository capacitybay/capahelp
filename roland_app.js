// I have Vanilla JS and JQuery selectors in this file

// let login_btn = document.querySelector(".btn1");
let login_btn = $(".btn1")
// let reg_btn = document.querySelector(".btn2");
let reg_btn = $(".btn2");
// let login = document.querySelector("#login");
let login = $('#login')
let login1 = $('.login-whole')
// let reg = document.querySelector(".reg");
let reg = $(".reg");
let reg1 = $(".reg-whole");
// let house = document.querySelector(".house");
let house = $(".house");
let x_btn = $(".h3");
let y_btn = $(".h3y");

login_btn.click(()=>{
    login.toggleClass("showForm");
    login1.toggleClass("show");
    house.toggleClass("effect");
})

reg_btn.click(()=>{
    reg.toggleClass("displayForm");
    reg1.toggleClass("display");
    house.toggleClass("thing");
});

x_btn.click(()=>{
    login.remove();
    login1.css('display', 'none');
    house.toggleClass("effect");
    location.reload();
})

y_btn.click(()=>{
    reg.css('display', 'none');
    reg1.css('display', 'none');
    house.toggleClass("thing");
    location.reload();
})


