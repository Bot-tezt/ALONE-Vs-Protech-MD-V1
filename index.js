"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baileys_1 = __importStar(require("@whiskeysockets/baileys"));
const logger_1 = __importDefault(require("@whiskeysockets/baileys/lib/Utils/logger"));
const logger = logger_1.default.child({});
logger.level = 'silent';
const pino = require("pino");
const boom_1 = require("@hapi/boom");
const conf = require("./set");
const axios = require("axios");
let fs = require("fs-extra");
let path = require("path");
const FileType = require('file-type');
const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter');
//import chalk from 'chalk'
const { verifierEtatJid , recupererActionJid } = require("./bdd/antilien");
const { atbverifierEtatJid , atbrecupererActionJid } = require("./bdd/antibot");
let evt = require(__dirname + "/framework/zokou");
const {isUserBanned , addUserToBanList , removeUserFromBanList} = require("./bdd/banUser");
const  {addGroupToBanList,isGroupBanned,removeGroupFromBanList} = require("./bdd/banGroup");
const {isGroupOnlyAdmin,addGroupToOnlyAdminList,removeGroupFromOnlyAdminList} = require("./bdd/onlyAdmin");
//const //{loadCmd}=require("/framework/mesfonctions")
let { reagir } = require(__dirname + "/framework/app");
var session = conf.session.replace(/ALONE-MD;;;=>/g,"eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiTUk5Ukp4cHFZbHFzbGxlSndLWXQxSXpyU0Roa1ozdThwYUtjendvV21tMD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiOVFpMFkxWHllV3oyZEpVVEtlbHJSZ2pUMys4b2pqNzY0dmtLTlBReEZVRT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJhR3lBL1RXdG9mK2YrQ09TV0tyanYvMFRFV2FYaUFmYmcwQ1pQV3hENVdzPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJEZyttTmhEaFR1OVREcWc5UmZQR0QvRGw3QkFpYVRvOHU4M1MvWm9jR1dFPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjRPaUFpNVpsRFJaMjg1bEhVeGhqbGJPeHZ0M2w4b2V3emcxUk1MaGpBWDA9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InU3UG9MVnFBWFBMdzJSU0JDT0s5MGhhcyt5cSs4U09SV3BsdG5uR2RKaEU9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoib0twdUZlRWlHWmxjRlJ6cWF2ZnVrNHZVaWVnUzdVbFdXbXBOWGxkSWhIOD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiYTd4VHdoZXR2QWFPdzAzVFlFdENEMmIrSXJqaWJQdXBIRkFmQXlieWxqdz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlJldmhLRlMvcmpCZWthY3NYNDk4SGNuZTZ4Y3RXSWFBR2N0bEEwdEJmeXFQTGJsWDk1MDBFYVVXeGxJcHNiN1d1MHhyMFltUVVtMjFWdzFMZDVwTUNRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTI3LCJhZHZTZWNyZXRLZXkiOiJaSHpIQm1TbXJIOTdEaHlKUkFGdTNvWnVPSFlacnRmb3I0eDlERmJ3bXBzPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJDb0ZPaDZPVlFNR292a0JpNE1oN3JBIiwicGhvbmVJZCI6IjE0MzQ0NmI5LTUyNDQtNDIzNi04ODEzLTQ1YjQ1MzZmOTEzOSIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJjdFVxSkRrR3JIYzIvakVoSkNqN1QyVXhZYlE9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoibGpFQ0ZuQXc2UWtMZVpuNHNVVVpQZkdyRkVvPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IlI2TE41SFpSIiwibWUiOnsiaWQiOiIyMzc2NzM4MDUyMDg6MzdAcy53aGF0c2FwcC5uZXQiLCJuYW1lIjoiQ09WRU5BTlQgUFJPU1BFUiJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDSmIydjZnQ0VQRG9yYm9HR0JzZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiQXMxSUh1OUlnVDk5TlRFQWs1M0dobWVCL2xEemN4Zm5mdTc1OW85K2Yzbz0iLCJhY2NvdW50U2lnbmF0dXJlIjoieTlqWmRLS3FaV2pPN2YydWRQY2svTERKNUFSdmZrR20xQ2pzSEJRdHRLTHA5cWcxa0ZYTW5DcjdQZEtYYU1aR2daaVFhNmdXa3M2SWZ2MHgrL1A4REE9PSIsImRldmljZVNpZ25hdHVyZSI6IkZrd1IrampLbjlKMzVtZlIrdFh6TXRiWlB3WmhpNkU2QVhtekEzNy81NjZ2TDhPcUMxUkdQcy80cm5xQTJpUTlFYm1qQnI3d1dRMXJMNjhObzJaUUFRPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjM3NjczODA1MjA4OjM3QHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQlFMTlNCN3ZTSUUvZlRVeEFKT2R4b1puZ2Y1UTgzTVg1Mzd1K2ZhUGZuOTYifX1dLCJwbGF0Zm9ybSI6InNtYmEiLCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3MzI5OTgyNjksIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBTGlXIn0");
const prefixe = conf.PREFIXE;


async function authentification() {
    try {
       
        //console.log("le data "+data)
        if (!fs.existsSync(__dirname + "/auth/creds.json")) {
            console.log("connected successfully...");
            await fs.writeFileSync(__dirname + "/auth/creds.json", atob(session), "utf8");
            //console.log(session)
        }
        else if (fs.existsSync(__dirname + "/auth/creds.json") && session != "zokk") {
            await fs.writeFileSync(__dirname + "/auth/creds.json", atob(session), "utf8");
        }
    }
    catch (e) {
        console.log("Session Invalid " + e);
        return;
    }
}
authentification();
const store = (0, baileys_1.makeInMemoryStore)({
    logger: pino().child({ level: "silent", stream: "store" }),
});
setTimeout(() => {
    async function main() {
        const { version, isLatest } = await (0, baileys_1.fetchLatestBaileysVersion)();
        const { state, saveCreds } = await (0, baileys_1.useMultiFileAuthState)(__dirname + "/auth");
        const sockOptions = {
            version,
            logger: pino({ level: "silent" }),
            browser: ['ALONE-MD', "safari", "1.0.0"],
            printQRInTerminal: true,
            fireInitQueries: false,
            shouldSyncHistoryMessage: true,
            downloadHistory: true,
            syncFullHistory: true,
            generateHighQualityLinkPreview: true,
            markOnlineOnConnect: false,
            keepAliveIntervalMs: 30_000,
            /* auth: state*/ auth: {
                creds: state.creds,
                /** caching makes the store faster to send/recv messages */
                keys: (0, baileys_1.makeCacheableSignalKeyStore)(state.keys, logger),
            },
            //////////
            getMessage: async (key) => {
                if (store) {
                    const msg = await store.loadMessage(key.remoteJid, key.id, undefined);
                    return msg.message || undefined;
                }
                const.toputech/urls //fetch all data and combine it 
                repourl+menuUrl+mainData
