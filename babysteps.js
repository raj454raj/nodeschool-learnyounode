var s = 0;
var arr = process.argv.splice(2)
for (var i in arr) {
	s += Number(arr[i]);
}
console.log(s);