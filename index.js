/**
 * @author Zahir Hadi Athallah <zhirrrstudio@gmail.com>
 * @license MIT
 */


const request = require('request');
const cheerio = require('cheerio')

const Kodepos = (keywords) => {
    return new Promise(async (resolve, reject) => {
        let postalcode = 'https://carikodepos.com/';
        let url = postalcode+'?s='+keywords;

        await request.get({
            headers: {
                'Accept': 'application/json, text/javascript, */*;',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4209.3 Mobile Safari/537.36',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                'Origin': postalcode,
                'Referer': postalcode
            },
            url: url,
        }, function(error, response, body) {
            if (error) return reject(error);

            let $ = cheerio.load(body);
            var search = $('tr');

            if (!search.length) return reject('No result could be found');

            var results = [];
            search.each(function(i) {
                if (i != 0) {
                    var td = $(this).find('td');
                    var result = {};
                    td.each(function(i) {
                        var value = $(this).find('a').html();
                        var key = (i == 0) ? 'province' : (i == 1) ? 'city' : (i == 2) ? 'subdistrict' : (i == 3) ? 'urban' : 'postalcode';

                        result[key] = value;
                    })
                    results.push(result);
                }
            });
            return resolve(results);
        });
    });
};

module.exports = Kodepos
