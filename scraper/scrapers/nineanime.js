
const scraper = require('./scraper.js');
const { handleBookmarkGet } = require('./mongoHandler.js');


// generate url strings
const genAllUrl = page => `https://www4.9anime.is/updated?page=${page}`;
const genCompletedUrl = page => `https://www4.9anime.is/filter?status%5B0%5D=finished&page=${page}`;
const genLatestUrl = page => `https://www4.9anime.is/updated?page=${page}`;

const extractAllData = (i, el, $) => {
  const title = $(el).next().attr('data-jtitle');
  const altTitleStr = $(el).next().html();
  const altTitle = altTitleStr !== title ? [altTitleStr] : [];
  const latestStr = $(el).find('.ep').length ? $(el).find('.ep').html() : '';
  const latest = latestStr.length
    ? Number(latestStr.split('/')[0].split(' ')[2]) || 0
    : 0;
  const anime = true;
  return {
    title, altTitle, latest, anime,
  };
};

const extractCompletedData = (i, el, $) => {
  const title = $(el).next().attr('data-jtitle');
  const anime = true;
  return { title, anime };
};

const extractLatestData = (i, el, $) => {
  const title = $(el).next().attr('data-jtitle');
  const latestStr = $(el).find('.ep').length ? $(el).find('.ep').html() : '';
  const latest = latestStr.length
    ? Number(latestStr.split('/')[0].split(' ')[2]) || 0
    : 0;
  const anime = true;
  return { title, latest, anime };
};

const iterateCheck = ($) => {
  const check = !$('a.btn.btn-lg.btn-primary.pull-right.disabled').length;
  return check;
};
// const iterateCheckLatest = () => false;


const source = '9anime';

// configs
const scrapeAllConfig = {
  genUrlFunc: genAllUrl,
  extractFunc: extractAllData,
  iterateDomEle: 'a.poster',
  iterateCheck,
  source,
  type: 'all',
};
const scrapeCompletedConfig = {
  genUrlFunc: genCompletedUrl,
  extractFunc: extractCompletedData,
  iterateDomEle: 'a.poster',
  iterateCheck,
  source,
  type: 'completed',
};
const scrapeLatestConfig = {
  genUrlFunc: genLatestUrl,
  extractFunc: extractLatestData,
  iterateDomEle: 'a.poster',
  iterateCheck,
  source,
  type: 'latest',
};

const scrapeAll = async (req, res) => {
  res.send('scraper 9anime scrapeAll route');
  try {
    const exitObj = await scraper(scrapeAllConfig);
    console.log(exitObj);
  } catch (err) {
    console.error(err);
  }
};

const scrapeCompleted = async (req, res) => {
  res.send('scraper 9anime scrapeCompleted route');
  try {
    const exitObj = await scraper(scrapeCompletedConfig);
    console.log(exitObj);
  } catch (err) {
    console.error(err);
  }
};

const scrapeLatest = async (req, res) => {
  if (res) res.send('9anime scrapeLatest route');
  try {
    const bookmarkStr = await handleBookmarkGet(source);
    scrapeLatestConfig.breakVal = bookmarkStr;
    const exitObj = await scraper(scrapeLatestConfig);
    console.log(exitObj);
    return exitObj;
  } catch (err) {
    console.log(err);
    return err;
  }
};


module.exports = {
  scrapeAll,
  scrapeCompleted,
  scrapeLatest,
  scrapeAllConfig,
  scrapeCompletedConfig,
  scrapeLatestConfig,
};
