
var server = "http://localhost:12345/";
var webpage = "http://localhost:8888/brandanalysis-frontend/";

//want to bring data into JSON form [{priceRange: [], number of items: }, ..]
var dataset = [];
for (var i = 0; i<40; i++) {
	var fn = d3.random.normal(20, 3);
	var one = d3.max([fn()*2.5, 0]);
	var two 	= d3.max([fn()*2.5, 0]);
	console.log(one, two);
	var end = d3.max([one, two]);
	var start = d3.min([one, two]);
	var ni 		= Math.floor(Math.abs(Math.random(40)*(end - start)*(start)/10));
	dataset.push({pr: [start, end], ni: ni});
}
dataset.push({pr: [0,5], ni: 5});
console.log(dataset);

addBucket1(dataset);

callSupplyDemand("Nikon", 0, 1,  dateObjFromMoment(moment("02-02-2015", "MM-DD-YYYY"), moment()));

function callSupplyDemand(brand, country, condition, dateObj) {
  country = (typeof country !== 'undefined') ? country : 1;
  if (country == 'country' || country === null) {
    country = 1;
  }
  if (condition == 'condition' || condition === undefined || condition === null) {
    condition = 1;
  }
  country = castToArray(country);
  condition = castToArray(condition);
  if ( typeof dateObj === 'undefined' || dateObj === 'null') {
    dateObj = numDaysToObj(30);
  }

  var url = createURLPOST(server, 'getPrice');
  console.log('url in callSupplyDemand ' + url);
  $.getJSON( url, {
    brand: brand,
    country: country,
    condition: condition,
    date: dateObj
    }
  )
  .done(function( data ) {
      console.log(data);
			addBucket2(data);
  });
}

function addBucket2(dataset) {
	var margin = {top: 60, right: 60, left: 60, bottom: 60}
	var width = 1000 - margin.right - margin.left;
	var height = 600 - margin.top - margin.bottom;
	var heightDivided = height/d3.max(dataset.map(function(d) {return d.ni;}));

	var svg = d3.select('.bucket2').append('svg')
							.attr("width", width - (- margin.right - margin.left))
							.attr("height", height - (- margin.top - margin.bottom));

	var chart = svg.append('g')
			.attr('transform', 'translate(' + margin.top + ',' + margin.left + ')');

	var x = d3.scale.linear()
						.domain(
							[0,d3.max(dataset.map(
								function(d) {
									return d.pr[1];
									}
								))
							]
						)
						.range([0,width]);

	var y = d3.scale.linear()
			.domain([0,d3.max(dataset.map(function(d) {return d.ni;}))])
			.range([0, height]);

	chart.selectAll('rect')
			.data(dataset)
		.enter().append('rect')
			.attr("transform", function(d) {return "translate(" + x(d.pr[0]) + ", " + y(d.ni) + ")";})
			.attr('height', heightDivided)
			.attr('width', function(d) {return x(d.pr[1] - d.pr[0]); })
			.style("fill", "rgba(20, 20, 200, 0.3)");

	var xAxis = d3.svg.axis()
			.scale(x)
			.orient('top')
			.ticks(7)
			.tickFormat(d3.format("$"));

	var yAxis = d3.svg.axis()
			.scale(y)
			.orient('left');

	var gx = chart.append("g")
		.attr("class", "axis")
		.call(xAxis);

	var gy = chart.append("g")
		.attr("class", "axis")
		.call(yAxis);

	gx.append("text")
		.attr("transform", "translate(" + width/2 + ",0)")
		.attr("dy", "-2em")
		.text("Price Range");

	gy.append("text")
		.attr("transform", "translate(0," + height/2 + ")" + "rotate(-90)")
		.attr("dy", "-2.5em")
		.text("Number of items");
}

function addBucket1(dataset) {
	var margin = {top: 60, right: 60, left: 60, bottom: 60}
	var width = 600 - margin.right - margin.left;
	var height = 1000 - margin.top - margin.bottom;

	var svg = d3.select('svg')
							.attr("width", width - (- margin.right - margin.left))
							.attr("height", height - (- margin.top - margin.bottom));

	var chart = svg.append('g')
			.attr('transform', 'translate(' + margin.top + ',' + margin.left + ')');


	var x = d3.scale.linear()
						.domain(
							[0,d3.max(dataset.map(
								function(d) {
									return d.pr[1];
									}
								))
							]
						)
						.range([0,width]);
	var y = d3.scale.linear()
			.domain([0,d3.max(dataset.map(function(d) {return d.ni;}))])
			.range([0, height]);
	console.log(d3.max(dataset.map(function(d) {return d.ni;})));
	chart.selectAll('rect')
			.data(dataset)
		.enter().append('rect')
			.attr("transform", function(d) {return "translate(" + x(d.pr[0]) + ", 0)";})
			.attr('width', function(d,i) {return x(d.pr[1] - d.pr[0]);})
			.attr('height', function(d) {return y(d.ni); })
			.style("fill", "rgba(255, 0, 0, 0.1)");

			var xAxis = d3.svg.axis()
					.scale(x)
					.orient('top')
					.ticks(7)
					.tickFormat(d3.format("$"));

			var yAxis = d3.svg.axis()
					.scale(y)
					.orient('left');

			var gx = chart.append("g")
				.attr("class", "axis")
				.call(xAxis);

			var gy = chart.append("g")
				.attr("class", "axis")
				.call(yAxis);

			gx.append("text")
				.attr("transform", "translate(" + width/2 + ",0)")
				.attr("dy", "-2em")
				.text("Price Range");

			gy.append("text")
				.attr("transform", "translate(0," + height/2 + ")" + "rotate(-90)")
				.attr("dy", "-2.5em")
				.text("Number of items");
}

function dateObjFromMoment(startMom, endMom) {
  dateObj = {         //w/ 0 for January
    endYear : endMom.year(),
    endMonth : endMom.month(),
    endDay : endMom.date()
  };
  dateObj.startYear = startMom.year();
  dateObj.startMonth = startMom.month();
  dateObj.startDay = startMom.date();
  dateObj.numDays = endMom.diff(startMom, 'days');
  dateObj.getMoment = function(time) {
    if (time === "start") {
      // console.log((this.startMonth + 1) + '-' +  this.startDay + "-" + this.startYear);
      return moment(this.startDay + "-" + (this.startMonth + 1) + '-' +  this.startYear , "DD-MM-YYYY");
    }
    else if (time === "end") {
      return moment(this.endDay + "-" + (this.endMonth + 1) + "-" + this.endYear, "DD-MM-YYYY");
    } else {
      console.log('Error, use parameter start or end');
      return null;
    }
  };
  return dateObj;
}

function castToArray(input) {
  if (input.constructor !== Array) {
    var temp = input;
    input = [];
    input.push(temp);
  }
  return input;
}

function createURLPOST(pathname, subfolder) {
  var url = pathname + subfolder;
  return url;
}
