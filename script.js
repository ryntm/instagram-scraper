const puppeteer = require('puppeteer');
const express = require('express');
const exphbs = require("express-handlebars");
const router = require('./controllers/controllers_bachelor')
const connection = require('./config/connection')
require('dotenv').config({path:__dirname+'/.env'});

let port = 8080;

let app = express();

let date = new Date().toJSON().slice(0, 19);

// var myDate = new Date(1633071599000)
// var date = new Date().toLocaleString("en-US", {timeZone: "America/Los_Angeles"})

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));

// app.use(router);

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


let contestantArray = [];
app.listen(port, () => {
    
    console.log(`Listening on port ${port}`);
    
})

async function instaScraper(list) {
    let followersJSON;
    let followers;

    connection.query('SELECT * FROM bachelornation',
    async (err, res) => {
        if (err) {
            throw err;
        } else
        for (i = 0; i <= res.length-1; i++) {
            contestantArray.push(JSON.parse(JSON.stringify(res[i])))
        }
        console.log('Connected to Database!');


        console.log('hi')
        const browser = await puppeteer.launch({
            headless: false
        }); 
        const page = await browser.newPage();
        await page.goto('https://www.instagram.com/accounts/login')
        // await page.waitForNavigation();

        // await Promise.all([button.click(), page.waitForNavigation({waitUntil:'networkidle2'})])
        await page.waitForTimeout(5000)
        // await page.waitForNavigation({waitUntil: 'networkidle2'});
        await page.type('input[name=username]', 'ryancovertam@gmail.com', { delay: 30 })
        await page.type('input[name=password', 'PasswordforPodcast', { delay: 30 })
        await page.click('button[type=submit');
        // await page.waitForTimeout(5000)
        await page.waitForTimeout(7000)
        
        for (let i = 0; i <= list.length-1; i++) {
            await page.goto(`https://instagram.com/${list[i].insta_url}`);
            await page.waitForTimeout(5000)
            
            let [el] = await page.$x('//*[@id="react-root"]/section/main/div/header/section/ul/li[2]/a/span');
            if (el !== undefined) {
                
                followersJSON = await el.getProperty('title');
                followers = await followersJSON.jsonValue();
                followers = await followers.replace(/,/g,'');


                await connection.query(`INSERT INTO instagram_followers (bachelor_nation_id, followers_count) VALUES (${list[i].id}, ${followers})`)


                console.log(`Record inserted for ${list[i].name}: ${followers} followers.`)

                if (i === list.length-1) {
                    browser.close();
                    // process.exit();
                }

            } else {

                await connection.query(`INSERT INTO instagram_followers (bachelor_nation_id, followers_count) VALUES (${list[i].id}, NULL)`)

                console.log(`Record not inserted for ${list[i].name}. Account may have been suspended/deleted/changed.`)


                if (i === list.length-1) {
                    browser.close();
                    // process.exit();

                }
            }
        }
        }
    )
}

let run_count = 24;

async function startBrowser2() {
    const browser2 = await puppeteer.launch({
        headless: false
    }); 
    const page2 = await browser2.newPage();
    await page2.goto('https://www.instagram.com/accounts/login')
    // await page2.waitForNavigation();

    // await Promise.all([button.click(), page.waitForNavigation({waitUntil:'networkidle2'})])
    await page2.waitForTimeout(5000)
    // await page.waitForNavigation({waitUntil: 'networkidle2'});
    await page2.type('input[name=username]', 'ryancovertam@gmail.com', { delay: 30 })
    await page2.type('input[name=password', 'PasswordforPodcast', { delay: 30 })
    await page2.click('button[type=submit');

    async function taylorhourlyWatch() {
        // const browser2 = await puppeteer.launch({
        //     headless: false
        // }); 
        
        // await page.waitForTimeout(5000)
        let date = new Date().toLocaleString("en-US", {timeZone: "America/Los_Angeles"})

        await page2.waitForTimeout(13000)
    
        await page2.goto(`https://instagram.com/taymocha`);

        let waitTime = Math.floor(Math.random() * (15000 - 5000) + 5000)    

        await page2.waitForTimeout(waitTime)
                
        let [el] = await page2.$x('//*[@id="react-root"]/section/main/div/header/section/ul/li[2]/a/span');
        if (el !== undefined) {
            
            followersJSON = await el.getProperty('title');
            followers = await followersJSON.jsonValue();
            followers = await followers.replace(/,/g,'');
    
            await connection.query(`INSERT INTO taylor_progress (followers_count) VALUES (${followers})`)
    
            console.log(`Record inserted for Taylor Nolan: ${followers} followers.`)
    
            run_count--
            console.log(`${run_count} scrapes left.`)
            console.log(date)
        
            if (run_count > 0) {
                await page2.waitForTimeout(3600000)
                taylorhourlyWatch()
            } else {
                browser2.close();
                process.exit();
            }
    
        } else {
    
            await connection.query(`INSERT INTO taylor_progress (followers_count) VALUES (NULL)`)
    
            console.log(`Record not inserted for Taylor Nolan. Account may have been suspended/deleted/changed.`)
    
            run_count--
    
            if (run_count > 0) {
                await page2.waitForTimeout(5000)
                taylorhourlyWatch()
            } else {
                browser.close();
                process.exit();
            }
    
    
        }
    
    
    }

    await taylorhourlyWatch()

}



startBrowser2()
instaScraper(contestantArray)

