const { reactive, colletWatchFns } = require("../src/vue3Responsive.js");

let obj = reactive({
  name: "kobe",
  age: 19,
});

colletWatchFns(
  function foo() {
    console.log(obj.name);
  },
  function bar() {
    console.log(obj.age);
  }
);

obj.name = "hello";
obj.age = 100;
