export function
understandFarmerQuery(
query
){

const q =
query.toLowerCase();

if(
q.includes(
"తెల్ల పురుగు"
)
){

return {

crop:
"Cotton",

problem:
"Whitefly"

};

}

if(
q.includes(
"whitefly"
)
){

return {

crop:
"Cotton",

problem:
"Whitefly"

};

}

return {

crop:
"Unknown",

problem:
"Unknown"

};

}