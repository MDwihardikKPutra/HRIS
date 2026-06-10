"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { workRealizations, getUserById, formatDate } from "@/lib/data";
import { AlertCircle, Clock, CheckCircle2, XCircle, ClipboardList, Calendar, Filter } from "lucide-react";
import Modal from "@/components/Modal";

export default function KanbanBoard({ 
  projectId,
  filterType,
  filterValue,
  filterStart,
  filterEnd
}: { 
  projectId: number;
  filterType: "all" | "month" | "week" | "range";
  filterValue: string;
  filterStart: string;
  filterEnd: string;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [extendedUntil, setExtendedUntil] = useState("");

  const [columns, setColumns] = useState({
    pending: {
      id: "pending",
      title: "Menunggu Review",
      icon: Clock,
      color: "text-amber-600 bg-amber-50 border-amber-200",
      items: [] as any[],
    },
    rejected: {
      id: "rejected",
      title: "Ditolak",
      icon: XCircle,
      color: "text-rose-600 bg-rose-50 border-rose-200",
      items: [] as any[],
    },
    extended: {
      id: "extended",
      title: "Diperpanjang",
      icon: AlertCircle,
      color: "text-orange-600 bg-orange-50 border-orange-200",
      items: [] as any[],
    },
    approved: {
      id: "approved",
      title: "Disetujui",
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
      items: [] as any[],
    },
  });

  const applyFilter = (items: any[]) => {
    if (filterType === "all") return items;
    if (filterType === "month" && filterValue) {
      return items.filter((r) => r.realizationDate?.startsWith(filterValue));
    }
    if (filterType === "week" && filterValue) {
      const [yearStr, weekStr] = filterValue.split('-W');
      const year = parseInt(yearStr);
      const week = parseInt(weekStr);
      
      const jan4 = new Date(year, 0, 4);
      const dayOfWeek = jan4.getDay() === 0 ? 7 : jan4.getDay(); 
      const startOfWeek = new Date(year, 0, 4 - dayOfWeek + 1 + (week - 1) * 7);
      const endOfWeek = new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000);
      endOfWeek.setHours(23, 59, 59, 999);
      
      return items.filter(r => {
        const d = new Date(r.realizationDate);
        return d >= startOfWeek && d <= endOfWeek;
      });
    }
    if (filterType === "range") {
      return items.filter((r) => {
        const d = new Date(r.realizationDate);
        const start = filterStart ? new Date(filterStart) : new Date(0);
        let end = new Date('2100-01-01');
        if (filterEnd) {
          end = new Date(filterEnd);
          end.setHours(23, 59, 59, 999);
        }
        return d >= start && d <= end;
      });
    }
    return items;
  };

  const loadData = () => {
    const pReals = workRealizations.filter((wr) => wr.projectId === projectId);
    const filtered = applyFilter(pReals);
    setColumns((prev) => {
      const next = { ...prev };
      (Object.keys(next) as Array<keyof typeof next>).forEach((key) => {
        next[key] = { ...next[key], items: filtered.filter((r) => r.status === key) };
      });
      return next;
    });
  };

  useEffect(() => {
    setIsMounted(true);
    loadData();
  }, [projectId, filterType, filterValue, filterStart, filterEnd]);

  // Pending drag result — held until PM confirms via popup
  const [pendingDrag, setPendingDrag] = useState<any>(null);

  const onDragEnd = (result: any) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    // Don't move yet — show feedback popup first
    setPendingDrag({ source, destination });
    const sourceCol = columns[source.droppableId as keyof typeof columns];
    const item = sourceCol.items[source.index];
    setSelectedCard(item);
    setFeedbackText(item.feedback || "");
    setExtendedUntil(item.extendedUntil || "");
  };

  const applyDrag = (newStatus: string, feedback: string) => {
    if (!pendingDrag) return;
    const { source, destination } = pendingDrag;
    const sourceCol = columns[source.droppableId as keyof typeof columns];
    const destCol = columns[destination.droppableId as keyof typeof columns];
    const sourceItems = [...sourceCol.items];
    const destItems = source.droppableId === destination.droppableId ? sourceItems : [...destCol.items];
    const [draggedItem] = sourceItems.splice(source.index, 1);
    draggedItem.status = newStatus;
    draggedItem.feedback = feedback;
    if (newStatus === "extended") draggedItem.extendedUntil = extendedUntil;
    destItems.splice(destination.index, 0, draggedItem);
    setColumns({
      ...columns,
      [source.droppableId]: { ...sourceCol, items: source.droppableId === destination.droppableId ? destItems : sourceItems },
      [destination.droppableId]: { ...destCol, items: destItems },
    });
    setPendingDrag(null);
    setSelectedCard(null);
    setFeedbackText("");
    setExtendedUntil("");
  };

  const applyDirectDecision = (newStatus: string) => {
    if (!selectedCard) return;
    selectedCard.feedback = feedbackText;
    selectedCard.status = newStatus;
    if (newStatus === "extended") selectedCard.extendedUntil = extendedUntil;
    setSelectedCard(null);
    setFeedbackText("");
    setExtendedUntil("");
    setColumns({ ...columns });
  };

  const closeModal = () => {
    setPendingDrag(null);
    setSelectedCard(null);
    setFeedbackText("");
    setExtendedUntil("");
  };

  if (!isMounted) return <div className="p-8 text-center text-slate-500">Memuat Papan Kanban...</div>;

  return (
    <div className="flex flex-col h-full">

      {/* Board */}
      <div className="flex flex-1 overflow-x-auto gap-4 bg-white rounded-xl p-3 border border-slate-200 min-h-0">
        <DragDropContext onDragEnd={onDragEnd}>
          {Object.values(columns).map((col) => (
            <div key={col.id} className="flex flex-col flex-1 min-w-[260px] bg-white rounded-xl p-3 border border-slate-200">
              <div className={`flex items-center gap-2 mb-3 px-3 py-2 rounded-lg border ${col.color}`}>
                <col.icon className="w-4 h-4" />
                <h3 className="font-semibold text-[13px]">{col.title}</h3>
                <span className="ml-auto text-xs font-bold bg-white/70 px-2 py-0.5 rounded-full">{col.items.length}</span>
              </div>

              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 overflow-y-auto space-y-3 p-1 rounded-lg transition-colors ${
                      snapshot.isDraggingOver ? "bg-indigo-50/60 ring-1 ring-indigo-200" : ""
                    }`}
                  >
                    {col.items.map((item, index) => (
                      <Draggable key={item.id.toString()} draggableId={item.id.toString()} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => { setSelectedCard(item); setFeedbackText(item.feedback || ""); setExtendedUntil(item.extendedUntil || ""); }}
                            className={`p-3.5 rounded-xl border ${
                              ({
                                approved: "bg-emerald-50 border-emerald-100",
                                rejected: "bg-rose-50 border-rose-100",
                                extended: "bg-orange-50 border-orange-100",
                                pending:  "bg-amber-50  border-amber-100",
                              } as Record<string,string>)[col.id] || "bg-white border-slate-100"
                            } ${
                              snapshot.isDragging
                                ? "shadow-lg scale-[1.02] z-50"
                                : "shadow-sm hover:shadow-md cursor-pointer"
                            } transition-all`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">#{item.realizationNumber}</span>
                              <span className="text-[10px] font-medium text-slate-500">{formatDate(item.realizationDate)}</span>
                            </div>

                            <p className="text-[13px] font-medium text-slate-800 leading-snug mb-3 line-clamp-2">{item.activities}</p>

                            <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 mt-2.5">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-700">
                                  {getUserById(item.userId)?.name.charAt(0)}
                                </div>
                                <span className="text-xs font-medium text-slate-600">{getUserById(item.userId)?.name}</span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                {item.extendedUntil && (
                                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-orange-50 border border-orange-100" title={`Diperpanjang s/d ${item.extendedUntil}`}>
                                    <Calendar className="w-3 h-3 text-orange-500" />
                                    <span className="text-[10px] text-orange-600 font-medium">{item.extendedUntil}</span>
                                  </div>
                                )}
                                {item.feedback && (
                                  <div className="p-1 rounded bg-amber-50 text-amber-600" title="Ada Feedback">
                                    <ClipboardList className="w-3.5 h-3.5" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}

                    {col.items.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-24 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                        <p className="text-xs font-medium">Kosong</p>
                        <p className="text-[10px] mt-0.5">Drag kartu ke sini</p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </DragDropContext>
      </div>

      {/* Review / Confirm Modal */}
      {selectedCard && (
        <Modal
          isOpen={true}
          onClose={closeModal}
          title={pendingDrag ? `Konfirmasi → ${columns[pendingDrag.destination.droppableId as keyof typeof columns]?.title}` : "Detail Realisasi Kerja"}
          size="md"
          footer={
            <div className="flex items-center justify-between w-full">
              <button onClick={closeModal} className="px-4 py-2 text-[13px] font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
                {pendingDrag ? "Batalkan" : "Tutup"}
              </button>

              {/* FROM DRAG: single confirm button matching target column */}
              {pendingDrag && (() => {
                const destId = pendingDrag.destination.droppableId;
                const btnMap: Record<string, { label: string; cls: string; status: string }> = {
                  approved: { label: "✓ Konfirmasi Approve", cls: "bg-emerald-600 hover:bg-emerald-700 text-white", status: "approved" },
                  rejected: { label: "✕ Konfirmasi Tolak", cls: "bg-rose-600 hover:bg-rose-700 text-white", status: "rejected" },
                  extended: { label: "↻ Konfirmasi Perpanjang", cls: "bg-orange-500 hover:bg-orange-600 text-white", status: "extended" },
                  pending: { label: "↩ Kembalikan ke Review", cls: "bg-amber-500 hover:bg-amber-600 text-white", status: "pending" },
                };
                const btn = btnMap[destId];
                if (!btn) return null;
                const isExtended = destId === "extended";
                return (
                  <button
                    onClick={() => applyDrag(btn.status, feedbackText)}
                    disabled={isExtended && !extendedUntil}
                    title={isExtended && !extendedUntil ? "Isi tanggal perpanjangan terlebih dahulu" : ""}
                    className={`px-4 py-1.5 text-[12px] font-semibold rounded-md transition-colors ${btn.cls} disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    {btn.label}
                  </button>
                );
              })()}

              {/* FROM CLICK (no drag): edit feedback on reviewed cards or decision on pending */}
              {!pendingDrag && selectedCard.status !== "pending" && (
                <button
                  onClick={() => {
                    selectedCard.feedback = feedbackText;
                    if (selectedCard.status === "extended") selectedCard.extendedUntil = extendedUntil;
                    setColumns({ ...columns });
                    closeModal();
                  }}
                  className="px-4 py-1.5 text-[12px] font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
                >
                  Simpan Perubahan
                </button>
              )}

              {!pendingDrag && selectedCard.status === "pending" && (
                <div className="flex gap-2">
                  <button onClick={() => applyDirectDecision("rejected")} className="px-3 py-1.5 text-[12px] font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md border border-rose-200 transition-colors">Tolak</button>
                  <button onClick={() => applyDirectDecision("extended")} disabled={!extendedUntil} className="px-3 py-1.5 text-[12px] font-medium text-orange-700 bg-orange-50 hover:bg-orange-100 rounded-md border border-orange-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">Perpanjang</button>
                  <button onClick={() => applyDirectDecision("approved")} className="px-3 py-1.5 text-[12px] font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors">Approve</button>
                </div>
              )}
            </div>
          }
        >
          <div className="space-y-4">
            {/* Info */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Laporan Aktivitas</label>
              <div className="mt-1.5 p-3 bg-slate-50 border border-slate-100 rounded-lg text-[13px] text-slate-700 leading-relaxed">
                {selectedCard.activities}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Pelaksana</label>
                <p className="text-[13px] font-medium text-slate-900 mt-1">{getUserById(selectedCard.userId)?.name}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tanggal</label>
                <p className="text-[13px] font-medium text-slate-900 mt-1">{formatDate(selectedCard.realizationDate)}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Progress</label>
                <p className="text-[13px] font-bold text-indigo-700 mt-1">{selectedCard.progress}%</p>
              </div>
            </div>

            {/* Feedback textarea — always editable */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1.5 block flex items-center gap-1.5">
                  <ClipboardList className="w-3.5 h-3.5 text-indigo-500" />
                  Feedback / Catatan PM
                  <span className="text-slate-400 font-normal">(opsional)</span>
                </label>
                <textarea
                  rows={3}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Tulis instruksi revisi, apresiasi, atau catatan untuk karyawan..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all resize-none placeholder:text-slate-300"
                />
              </div>

              {/* Extended until — shown when dragging to extended OR card is already extended */}
              {(pendingDrag?.destination?.droppableId === "extended" || selectedCard.status === "extended" || (!pendingDrag && selectedCard.status === "pending")) && (
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1.5 block flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-orange-500" />
                    Perpanjang Sampai
                    {pendingDrag?.destination?.droppableId === "extended" && (
                      <span className="text-rose-500 font-semibold">*wajib</span>
                    )}
                  </label>
                  <input
                    type="date"
                    value={extendedUntil}
                    onChange={(e) => setExtendedUntil(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:border-orange-400 transition-colors"
                  />
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
