import {
  createBot,
  createProvider,
  createFlow
} from "@builderbot/bot";
import { MemoryDB as Database } from "@builderbot/bot";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";

const PORT = process.env.PORT ?? 3000;


const convertirRuta = (ruta) => {
  console.log("ruta entrante:",ruta)
  if (ruta.includes("\n")) {
    return ruta
      .split("\n") // Dividir por saltos de línea
      .filter((linea) => linea.trim() !== "") // Eliminar líneas vacías
      .map((ruta) =>
        ruta.startsWith("https://forms.app/recordimage/")
          ? ruta.replace(
              "https://forms.app/recordimage/",
              "https://file.forms.app/answerfilewithtoken/"
            )
          : ruta
      );
  } else {
    return ruta.trim() === ""
      ? []
      : ruta.startsWith("https://forms.app/recordimage/")
      ? ruta.replace(
          "https://forms.app/recordimage/",
          "https://file.forms.app/answerfilewithtoken/"
        )
      : ruta;
  }
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
      console.log(req.body);
      //'120363376889510859@g.us'
      try {
        const ruta = convertirRuta(data.imagen)
        const rutas = Array.isArray(ruta) ? ruta : [ruta];
        for(const r of rutas){
          await bot.provider.sendImage(data.grupoJid,r,"");
        }
        if(data.tipo_mensaje == "completa"){
          const mensaje = [
            `📅  FECHA DE MATRICULA : *${data.fecha_matricula ?? '-'}*`,
          `🟢 CODIGO CAMPAÑA : *${data.codigo ?? '-'}*`,
            `-------------------------------`,
            `☎  ASESOR : *${data.asesor ?? '-'}*`,
            `NOMBRE Y APELLIDO : *${data.nombre ?? '-'}* *${data.apellido ?? '-'}*`,
            `NUMERO : *${data.numero_celular ?? '-'}*`,
            `DNI : *${data.dni ?? '-'}*`,
            `CORREO : *${data.correo ?? '-'}*`,
            `PROGRAMA : *${data.programa ?? '-'}*`,
            `FECHA DE INICIO: *${data.fecha_inicio ?? '-'}*`,
            `-------------------------------`,
            `✅ TIPO DE PAGO : *${data.tipo_pago ?? '-'}*`,
            `TIPO DE VENTA : *${data.tipo_venta ?? '-'}*`,
            `ESTADO VENTA COMPLETA : *${data.estado_venta ?? '-'}*`,
            `FECHA PAGO : *${data.fecha_pago ?? '-'}*`,
            `MONTO PAGO : *${data.monto_completo ?? '-'}*`,
            `🎁 INCLUYE PROGRAMA DE REGALO : *${data.incluye_programa ?? '-'}*`,
            `🎁 PROGRAMA DE REGALO : *${data.nombre_programa ?? '-'}*`,
            `-------------------------------`,
            `CEL : *${data.cel ?? '-'}*`,
            `CIP : *${data.cip ?? '-'}*`,
            `CARNET : *${data.carnet ?? '-'}*`,
            `AUTODESK : *${data.autodesk ?? '-'}*`,
            `PMI : *${data.pmi ?? '-'}*`,
            `CERTI. FISICO CCD : *${data.cert_fisico ?? '-'}*`,
            `CERTI: DIGITAL CCD : *${data.cert_digital ?? '-'}*`,
            `PREPARACION LICENCIAMIENTO : *${data.preparacion_licen ?? '-'}*`,
            `-------------------------------`,
            `📍 OBSERVACION:`,
            `*${data.observacion ?? '-'}*`
          ].join("\n");
          await bot.provider.sendText(data.grupoJid,mensaje);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ status: true}));
        }else{
          const mensaje = [
            `📅  FECHA DE MATRICULA : *${data.fecha_matricula ?? '-'}*`,
          `🟢 CODIGO CAMPAÑA : *${data.codigo ?? '-'}*`,
            `-------------------------------`,
            `☎  ASESOR : *${data.asesor ?? '-'}*`,
            `NOMBRE Y APELLIDO : *${data.nombre ?? '-'}* *${data.apellido ?? '-'}*`,
            `NUMERO : *${data.numero_celular ?? '-'}*`,
            `DNI : *${data.dni ?? '-'}*`,
            `CORREO : *${data.correo ?? '-'}*`,
            `PROGRAMA : *${data.programa ?? '-'}*`,
            `FECHA DE INICIO: *${data.fecha_inicio ?? '-'}*`,
            `-------------------------------`,
            `✅ TIPO DE PAGO : *${data.tipo_pago ?? '-'}*`,
            `TIPO DE VENTA : *${data.tipo_venta ?? '-'}*`,
            `ESTADO 1ER PAGO : *${data.estado_1erpago ?? '-'}*`,
            `FECHA 1ER PAGO : *${data.fecha_1erpago ?? '-'}*`,
            `MONTO 1ER PAGO : *${data.monto_1erpago ?? '-'}*`,
            ``,
            `ESTADO 2DO PAGO: *${data.estado_2dopago ?? '-'}*`,
            `FECHA 2DO PAGO : *${data.fecha_2dopago ?? '-'}*`,
            `MONTO 2DO PAGO : *${data.monto_2dopago ?? '-'}* `,
            ``,
            `🎁 INCLUYE PROGRAMA DE REGALO : *${data.incluye_programa ?? '-'}*`,
            `🎁 PROGRAMA DE REGALO : *${data.nombre_programa ?? '-'}*`,
            `-------------------------------`,
            `CEL : *${data.cel ?? '-'}*`,
            `CIP : *${data.cip ?? '-'}*`,
            `CARNET : *${data.carnet ?? '-'}*`,
            `AUTODESK : *${data.autodesk ?? '-'}*`,
            `PMI : *${data.pmi ?? '-'}*`,
            `CERTI. FISICO CCD : *${data.cert_fisico ?? '-'}*`,
            `CERTI: DIGITAL CCD : *${data.cert_digital ?? '-'}*`,
            `PREPARACION LICENCIAMIENTO : *${data.preparacion_licen ?? '-'}*`,
            `-------------------------------`,
            `📍 OBSERVACION:`,
            `*${data.observacion ?? '-'}*`
          ].join("\n");
          await bot.provider.sendText(data.grupoJid,mensaje);
        }
        res.writeHead(200, { 'Content-Type': 'application/json' })
        return res.end(JSON.stringify({ status: true}));
      } catch (error) {
        console.log(error)
        res.writeHead(400, { 'Content-Type': 'application/json' })
        return res.end(JSON.stringify({ status: false,
          imagen:data.ruta
        }));
      }
      
    })
  );
  adapterProvider.server.post(
    "/prueba",
    handleCtx(async (bot, req, res) => {
      const data = req.body;
      const ruta = convertirRuta(data.imagen)
      await bot.provider.sendImage(data.grupoJid,ruta,`📅  FECHA DE MATRICULA : 28/1/2025
🟢 CODIGO CAMPAÑA : METRA1
-------------------------------
☎  ASESOR : ABIGAIL GASTOLOMENDO
NOMBRE Y APELLIDO : OWEN ALEXANDER  ALEX
NUMERO : 943299471
DNI : 75078006
CORREO : pfluckerjaramillo@gmail.com
PROGRAMA : ADMINISTRACIÓN DOCUMENTARIA Y DE ARCHIVO EN EL SECTOR PÚBLICO
FECHA DE INICIO: 30/1/2025
-------------------------------
✅ TIPO DE PAGO : VENTA
TIPO DE VENTA : COMPLETA
ESTADO VENTA COMPLETA : PAGO
FECHA PAGO : 12/12/2025
MONTO PAGO : S/.13.433.341,00
🎁 INCLUYE PROGRAMA DE REGALO : Sí
🎁 PROGRAMA DE REGALO : 3x1 - P6/EXCEL/PBI
-------------------------------
CEL : SI
CIP : SI
CARNET : SI
AUTODESK : SI
PMI : SI
CERTI. FISICO CCD : SI
CERTI: DIGITAL CCD : SI
PREPARACION LICENCIAMIENTO : NO
-------------------------------
📍 OBSERVACION:
OWEN`);
      await bot.provider.sendText(data.grupoJid,"mensaje");
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
