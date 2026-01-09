import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";


export async function exportMeasurementCsv(item) {
  let rows = [];

  if (Array.isArray(item?.results?.points) && item.results.points.length) {
    rows = item.results.points.map((p) => ({
      freqHz: p.freqHz,
      thresholdDbHL: p.thresholdDbHL,
    }));
  } else if (Array.isArray(item?.freqsHz) && Array.isArray(item?.thresholdsDbHL)) {
    rows = item.freqsHz.map((f, i) => ({
      freqHz: f,
      thresholdDbHL: item.thresholdsDbHL[i],
    }));
  }

  const createdAt = item?.createdAt ? new Date(item.createdAt) : null;
  const createdStr = createdAt ? createdAt.toISOString().slice(0, 19).replace(/[:T]/g, "-") : "unknown-date";

  const headerLines = [
    `title,${escapeCsv(item?.title ?? "")}`,
    `ear,${escapeCsv(item?.ear ?? "")}`,
    `createdAt,${escapeCsv(createdAt ? createdAt.toISOString() : "")}`,
    `note,${escapeCsv(item?.note ?? "")}`,
    "",
  ].join("\n");

  const csvHeader = "freqHz,thresholdDbHL";
  const csvBody = rows.map((r) => `${r.freqHz},${r.thresholdDbHL}`).join("\n");

  const csv = `${headerLines}\n${csvHeader}\n${csvBody}\n`;

  const fileName = `measurement_${createdStr}_${item?.ear ?? "ear"}.csv`;
  const fileUri = FileSystem.documentDirectory + fileName;

  await FileSystem.writeAsStringAsync(fileUri, csv);

  const canShare = await Sharing.isAvailableAsync();
  if (!canShare) {
    throw new Error("Sharing is not available on this device.");
  }

  await Sharing.shareAsync(fileUri, {
    mimeType: "text/csv",
    dialogTitle: "CSV export megosztása",
    UTI: "public.comma-separated-values-text",
  });
}

function escapeCsv(value) {
  const s = String(value ?? "");
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}
