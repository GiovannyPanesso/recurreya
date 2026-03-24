import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 60,
    fontFamily: "Helvetica",
    fontSize: 11,
    lineHeight: 1.6,
    color: "#1a1a1a",
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: "#1a3a6e",
    paddingBottom: 15,
  },
  titulo: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#1a3a6e",
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 10,
    color: "#666",
  },
  seccion: {
    marginBottom: 20,
  },
  seccionTitulo: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#1a3a6e",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  parrafo: {
    marginBottom: 8,
    textAlign: "justify",
  },
  datoFila: {
    flexDirection: "row",
    marginBottom: 4,
  },
  datoLabel: {
    fontFamily: "Helvetica-Bold",
    width: 160,
    fontSize: 10,
  },
  datoValor: {
    flex: 1,
    fontSize: 10,
  },
  firma: {
    marginTop: 40,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 20,
  },
  aviso: {
    marginTop: 20,
    fontSize: 8,
    color: "#bbbbbb",
    textAlign: "center",
  },
});

interface EscritoPDFProps {
  escrito: string;
  nombreCompleto: string;
  dni: string;
  direccion: string;
  numeroExpediente: string;
  fechaLimite: string;
  organismo: string;
}

export function EscritoPDF({
  escrito,
  nombreCompleto,
  dni,
  direccion,
  numeroExpediente,
  fechaLimite,
  organismo,
}: EscritoPDFProps) {
  // Dividir el escrito en párrafos
  const parrafos = escrito
    .split("\n")
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Cabecera */}
        <View style={styles.header}>
          <Text style={styles.titulo}>RECURSO DE REPOSICIÓN</Text>
          <Text style={styles.subtitulo}>
            Expediente: {numeroExpediente} · Generado por RecurreYa
          </Text>
        </View>

        {/* Datos del recurrente */}
        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Datos del recurrente</Text>
          <View style={styles.datoFila}>
            <Text style={styles.datoLabel}>Nombre:</Text>
            <Text style={styles.datoValor}>{nombreCompleto}</Text>
          </View>
          <View style={styles.datoFila}>
            <Text style={styles.datoLabel}>DNI:</Text>
            <Text style={styles.datoValor}>{dni}</Text>
          </View>
          <View style={styles.datoFila}>
            <Text style={styles.datoLabel}>Domicilio:</Text>
            <Text style={styles.datoValor}>{direccion}</Text>
          </View>
          <View style={styles.datoFila}>
            <Text style={styles.datoLabel}>Expediente:</Text>
            <Text style={styles.datoValor}>{numeroExpediente}</Text>
          </View>
          <View style={styles.datoFila}>
            <Text style={styles.datoLabel}>Dirigido a:</Text>
            <Text style={styles.datoValor}>{organismo}</Text>
          </View>
        </View>

        {/* Cuerpo del escrito */}
        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Escrito de alegaciones</Text>
          {parrafos.map((parrafo, index) => (
            <Text key={index} style={styles.parrafo}>
              {parrafo}
            </Text>
          ))}
        </View>

        {/* Firma */}
        <View style={styles.firma}>
          <Text style={styles.parrafo}>
            En Madrid, a{" "}
            {new Date().toLocaleDateString("es-ES", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Text>
          <Text style={styles.parrafo}>Fdo: {nombreCompleto}</Text>
          <Text style={styles.parrafo}>DNI: {dni}</Text>
        </View>

        {/* Aviso legal */}
        <View style={styles.aviso}>
          <Text>
            Documento generado con asistencia de RecurreYa (recurreya.es) ·
            Plazo límite de presentación: {fechaLimite}.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
