import {
  createBot,
  createProvider,
  createFlow
} from "@builderbot/bot";
import { MemoryDB as Database } from "@builderbot/bot";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";

const PORT = process.env.PORT ?? 3000;


const convertirRuta = (ruta) => {
  if (ruta.startsWith("https://forms.app/recordimage/")) {
    return ruta.replace(
      "https://forms.app/recordimage/",
      "https://file.forms.app/answerfilewithtoken/"
    );
  }
  return ruta;
};
const main = async () => {
  const adapterFlow = createFlow([]);

  const adapterProvider = createProvider(Provider, { usePairingCode: true, phoneNumber:"51948701436"})
  const adapterDB = new Database();

  const { handleCtx, httpServer } = await createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  adapterProvider.server.post(
    "/data",
    handleCtx(async (bot, req, res) => {
      const data = req.query;
      //'120363376889510859@g.us'
      const ruta = convertirRuta(data.voucher)
      const result = await bot.provider.sendMedia(data.grupoJid,ruta,[
        `Nombre: *${data.nombre} ${data.apellido}*`,
        `DNI: ${data.dni}`,
        `Cel: ${data.celular}`,
        `Correo: `,
        `PROGRAMA: *${data.programa}*`,
        `CODIGO: ${data.codigo}`,
        `INICIO: *${data.inicio}*`,
        `MONTO TOTAL: S/ ${data.monto} SOLES`,
        `(Incluye certificado CCD digital y físico ccd)`,
        ``,
        `PAGO COMPLETO PAGADO✅: ${data.fecha_pago}`,
        '',
        `ASESOR: ${data.asesor}`
      ].join("\n"))
      res.writeHead(200, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify({ status: true}));
    })
  );
  adapterProvider.server.post(
    "/prueba",
    handleCtx(async (bot, req, res) => {
      const data = req.body;
      console.log(data);
      console.log(req.query)
      res.writeHead(200, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify({ status: true}));
    })
  );
  adapterProvider.server.get(
    '/v1/codigo',
    handleCtx(async (bot, req, res) => {
        const pairingCode = bot.provider.vendor.authState.creds.pairingCode;
        res.writeHead(200, { 'Content-Type': 'application/json' })
        return res.end(JSON.stringify({ pairingCode: pairingCode}))
    })
)
  httpServer(+PORT);
};

main();
