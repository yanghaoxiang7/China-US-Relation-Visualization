

var details_data = null;
var details_data_file = './data/merged.csv';



function tokenize(s){
    words = s.split(/[\s.]+/g)
        .map(d => d.replace(/[.,:;"\?!\+&-]+/g, ""))
        .map(d => d.replace(/'\S+/g, ""))
        .map(d => d.toLowerCase());
    return words;
}

function _get_detail(from_year, from_month, from_day,
    to_year, to_month, to_day, SourceArray, WordWeight, num_of_details_displayed)
{
    var start = Date.now();
    // SourceArray should be like: Array('chinadaily', 'nytimes')
    // SourceArray can be a string: 'all'
    // WordWeight should be like: {'apple': 0.4, 'banana': 0.6}
    // console.log(details_data);
    let details_data_len = details_data.length;

    let IsInArray = {}
    if (SourceArray != 'all')
        for (id in SourceArray)
        {
            console.log("SourceArray", SourceArray[id]);
            IsInArray[SourceArray[id]] = true;
        }

    let Weight = {}

    let from_date = new Date()
    from_date.setFullYear(from_year, from_month, from_day)
    let to_date = new Date()
    to_date.setFullYear(to_year, to_month, to_day)
    // console.log(from_date)
    // console.log(to_date)
    
    var processed_data = new Array()

    for (let i = 0; i < details_data_len; i += 30)
    {
        let thisday = new Date(details_data[i]["date"])
        if (!(from_date <= thisday && thisday <= to_date))
            continue;
        if (SourceArray != 'all')
        {
            src = details_data[i]["source"];
            if (src == 'latimes')
            if (IsInArray[src] == null)
                continue;
        }
        let sum = 0;
        let str = details_data[i]["headline"] + details_data[i]["abstract"];
        let tokens = tokenize(str);
        for (id in tokens)
        {
            if (WordWeight[tokens[id]] != null)
                sum = sum + WordWeight[tokens[id]];
        }
        if (sum == 0) continue;
        var now = details_data[i];
        now["weight"] = sum;
        processed_data.push(now);
    }
    // console.log(processed_data)
    processed_data.sort((a, b) => d3.descending(a["weight"], b["weight"]));
    var end = Date.now();
    // console.log("time", end - start);
    // console.log("len", processed_data.length);
    return processed_data.slice(0, num_of_details_displayed);
}

function get_detail(from_year, from_month, from_day,
    to_year, to_month, to_day, SourceArray, WordWeight, num_of_details_displayed = 5) {

    if (details_data == null)
    {
        return d3.csv(details_data_file).then(function (DATA) {
            details_data = DATA;
            return _get_detail(
                from_year, from_month, from_day, to_year, to_month, to_day,
                SourceArray, WordWeight, num_of_details_displayed
            );
        });
    }
    else
    {
        return new Promise(function(resolve, reject) {
            resolve(_get_detail(
            from_year, from_month, from_day, to_year, to_month, to_day,
            SourceArray, WordWeight, num_of_details_displayed
            ));
        });
    }
}

var sleep = function(time) {
    var startTime = new Date().getTime() + parseInt(time, 10);
    while(new Date().getTime() < startTime) {}
};
