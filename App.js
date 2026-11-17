import React, { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView, View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Modal, Alert, Share, Platform, StatusBar
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@rose_vendas_mvp_v1";
const COLORS = {
  pink: "#D94F83", pinkLight: "#FCE8F0", ink: "#302630",
  muted: "#817681", bg: "#FAF7F9", line: "#EEE5EB",
  green: "#27845E", amber: "#A86B12", white: "#FFFFFF"
};

const PRODUCTS = [
  { id: 1, name: "Hidratante Tododia", category: "Corpo", price: 59.9, interval: 45 },
  { id: 2, name: "Natura Kaiak", category: "Perfumaria", price: 139.9, interval: 60 },
  { id: 3, name: "Sabonete em barra (kit)", category: "Corpo", price: 29.9, interval: 30 },
  { id: 4, name: "Sérum facial", category: "Rosto", price: 89.9, interval: 50 },
  { id: 5, name: "Shampoo e condicionador", category: "Cabelos", price: 69.9, interval: 40 }
];
const FIRST = [
  ["Maria Oliveira", "21987651001", "1988-04-12", "Hidratantes e perfumaria", "Prefere contato à tarde"],
  ["Ana Souza", "21987651002", "1992-09-03", "Cuidados com o rosto", "Gosta de novidades"],
  ["Carla Mendes", "21987651003", "1985-01-22", "Sabonetes e corpo", "Prefere kits promocionais"],
  ["Juliana Costa", "21987651004", "1995-07-17", "Perfumaria", ""],
  ["Patrícia Lima", "21987651005", "1989-11-28", "Cabelos e corpo", ""]
];
const FIRST_NAMES = ["Beatriz","Camila","Fernanda","Gabriela","Larissa","Mariana","Rafaela","Renata","Aline","Bruna","Débora","Isabela","Letícia","Natália","Paula","Sabrina","Tatiane","Vanessa","Amanda","Bianca"];
const LAST_NAMES = ["Almeida","Barbosa","Carvalho","Dias","Fernandes","Gomes","Lima","Martins","Mendes","Nascimento","Oliveira","Pereira","Ribeiro","Santos","Silva"];

const isoDate = (date = new Date()) => {
  const d = new Date(date);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};
const daysAgo = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return isoDate(d); };
const addDays = (date, n) => { const d = new Date(`${date}T12:00:00`); d.setDate(d.getDate() + n); return isoDate(d); };
const dateBR = (date) => date ? new Date(`${date}T12:00:00`).toLocaleDateString("pt-BR") : "—";
const money = (value) => Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function makeInitialData() {
  const clients = [
    ...FIRST.map((c, i) => ({
      id: i + 1, name: c[0], phone: c[1], birthday: c[2],
      preferences: c[3], notes: c[4], createdAt: daysAgo(100 - i * 7)
    })),
    ...Array.from({ length: 65 }, (_, i) => ({
      id: i + 6,
      name: `${FIRST_NAMES[i % FIRST_NAMES.length]} ${LAST_NAMES[(i * 7) % LAST_NAMES.length]}`,
      phone: `219${String(8765200 + i).slice(-7)}`,
      birthday: `19${String(70 + (i % 30)).padStart(2, "0")}-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 27) + 1).padStart(2, "0")}`,
      preferences: ["Perfumaria", "Cuidados com a pele", "Corpo e banho", "Cabelos", "Presentes e kits"][i % 5],
      notes: i % 4 === 0 ? "Prefere contato pelo WhatsApp" : "",
      createdAt: daysAgo(80 - (i % 60))
    }))
  ];
  return {
    clients, products: PRODUCTS,
    orders: [
      { id: 1001, clientId: 1, productId: 1, quantity: 1, price: 59.9, date: daysAgo(38), status: "Concluído" },
      { id: 1002, clientId: 2, productId: 4, quantity: 1, price: 89.9, date: daysAgo(54), status: "Concluído" },
      { id: 1003, clientId: 3, productId: 3, quantity: 2, price: 29.9, date: daysAgo(27), status: "Concluído" },
      { id: 1004, clientId: 4, productId: 2, quantity: 1, price: 139.9, date: daysAgo(20), status: "Concluído" },
      { id: 1005, clientId: 5, productId: 5, quantity: 1, price: 69.9, date: daysAgo(15), status: "Pendente" }
    ],
    completedReminders: []
  };
}

function AppButton({ title, onPress, variant = "primary", compact = false }) {
  return (
    <TouchableOpacity onPress={onPress} style={[
      styles.button, variant === "secondary" && styles.buttonSecondary,
      variant === "outline" && styles.buttonOutline, variant === "danger" && styles.buttonDanger,
      compact && styles.buttonCompact
    ]}>
      <Text style={[styles.buttonText, variant !== "primary" && styles.buttonTextDark]}>{title}</Text>
    </TouchableOpacity>
  );
}
function Field({ label, value, onChangeText, placeholder, keyboardType, multiline }) {
  return <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      value={value} onChangeText={onChangeText} placeholder={placeholder}
      placeholderTextColor="#AA9FAA" keyboardType={keyboardType || "default"}
      multiline={multiline} style={[styles.input, multiline && { minHeight: 76, textAlignVertical: "top" }]}
    />
  </View>;
}
function Pill({ text, tone = "pink" }) {
  return <View style={[styles.pill, tone === "green" && styles.pillGreen, tone === "amber" && styles.pillAmber]}>
    <Text style={[styles.pillText, tone === "green" && { color: COLORS.green }, tone === "amber" && { color: COLORS.amber }]}>{text}</Text>
  </View>;
}
function SectionTitle({ title, right }) {
  return <View style={styles.sectionTitle}><Text style={styles.sectionHeading}>{title}</Text>{right}</View>;
}

export default function App() {
  const [data, setData] = useState(makeInitialData);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState("Painel");
  const [clientModal, setClientModal] = useState(false);
  const [orderModal, setOrderModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [clientForm, setClientForm] = useState({ name: "", phone: "", birthday: "", preferences: "", notes: "" });
  const [orderForm, setOrderForm] = useState({ clientId: "1", productId: "1", quantity: "1", price: "59.90", date: isoDate(), status: "Concluído" });

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) setData(JSON.parse(saved));
      } catch (e) {
        Alert.alert("Aviso", "Não foi possível carregar os dados salvos. Será usada a base de demonstração.");
      } finally { setLoaded(true); }
    })();
  }, []);
  useEffect(() => {
    if (loaded) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)).catch(() => {});
  }, [data, loaded]);

  const clientById = (id) => data.clients.find(c => c.id === id);
  const productById = (id) => data.products.find(p => p.id === id);
  const clientName = (id) => clientById(id)?.name || "Cliente";
  const productName = (id) => productById(id)?.name || "Produto";

  const reminders = useMemo(() => {
    const list = [];
    data.orders.filter(o => o.status === "Concluído").forEach(order => {
      const product = data.products.find(p => p.id === order.productId);
      if (!product) return;
      const dueDate = addDays(order.date, product.interval);
      const key = `${order.clientId}-${order.productId}-${dueDate}`;
      if (!data.completedReminders.includes(key) && !list.some(x => x.key === key)) {
        list.push({ key, clientId: order.clientId, productId: order.productId, dueDate });
      }
    });
    return list.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [data]);

  const monthOrders = data.orders.filter(o => o.date.slice(0, 7) === isoDate().slice(0, 7) && o.status === "Concluído");
  const monthSales = monthOrders.reduce((sum, o) => sum + o.quantity * o.price, 0);

  function openNewClient() {
    setEditingId(null);
    setClientForm({ name: "", phone: "", birthday: "", preferences: "", notes: "" });
    setClientModal(true);
  }
  function openEditClient(client) {
    setEditingId(client.id);
    setClientForm({ name: client.name, phone: client.phone, birthday: client.birthday || "", preferences: client.preferences || "", notes: client.notes || "" });
    setClientModal(true);
  }
  function saveClient() {
    if (!clientForm.name.trim() || !clientForm.phone.trim()) {
      Alert.alert("Campos obrigatórios", "Informe o nome e o telefone do cliente."); return;
    }
    if (editingId) {
      setData(old => ({ ...old, clients: old.clients.map(c => c.id === editingId ? { ...c, ...clientForm } : c) }));
    } else {
      setData(old => ({ ...old, clients: [...old.clients, { ...clientForm, id: Math.max(0, ...old.clients.map(c => c.id)) + 1, createdAt: isoDate() }] }));
    }
    setClientModal(false);
  }
  function removeClient(client) {
    Alert.alert("Excluir cliente", `Deseja excluir ${client.name} e os pedidos relacionados?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: () => setData(old => ({
        ...old, clients: old.clients.filter(c => c.id !== client.id),
        orders: old.orders.filter(o => o.clientId !== client.id)
      })) }
    ]);
  }
  function openNewOrder() {
    if (!data.clients.length) { Alert.alert("Cadastre um cliente", "Adicione um cliente antes de registrar um pedido."); return; }
    const product = data.products[0];
    setOrderForm({ clientId: String(data.clients[0].id), productId: String(product.id), quantity: "1", price: String(product.price), date: isoDate(), status: "Concluído" });
    setOrderModal(true);
  }
  function saveOrder() {
    const qty = Number(orderForm.quantity), price = Number(orderForm.price);
    if (!orderForm.clientId || !orderForm.productId || !orderForm.date || qty < 1 || price < 0) {
      Alert.alert("Confira os dados", "Preencha os campos do pedido corretamente."); return;
    }
    setData(old => ({ ...old, orders: [...old.orders, {
      id: Math.max(1000, ...old.orders.map(o => o.id)) + 1,
      clientId: Number(orderForm.clientId), productId: Number(orderForm.productId),
      quantity: qty, price, date: orderForm.date, status: orderForm.status
    }] }));
    setOrderModal(false);
  }
  async function shareMessage(item) {
    const client = clientById(item.clientId), product = productById(item.productId);
    const firstName = client?.name?.split(" ")[0] || "tudo bem";
    const message = `Oi, ${firstName}! Tudo bem? 😊\n\nPassando para saber como está seu ${product?.name}. Como está próximo do período estimado de reposição, pensei em te avisar caso esteja precisando.\n\nSe quiser, posso verificar as opções disponíveis para você! 💕`;
    try { await Share.share({ message }); } catch (e) { Alert.alert("Mensagem", message); }
  }
  function completeReminder(item) {
    setData(old => ({ ...old, completedReminders: [...old.completedReminders, item.key] }));
  }
  function resetDemo() {
    Alert.alert("Restaurar demonstração", "Isso substitui os dados atuais pelos 70 clientes e pedidos fictícios iniciais.", [
      { text: "Cancelar", style: "cancel" },
      { text: "Restaurar", style: "destructive", onPress: () => setData(makeInitialData()) }
    ]);
  }

  const filteredClients = data.clients.filter(c => `${c.name} ${c.phone}`.toLowerCase().includes(search.toLowerCase()));
  const filteredOrders = [...data.orders].filter(o => clientName(o.clientId).toLowerCase().includes(search.toLowerCase())).sort((a,b) => b.date.localeCompare(a.date));
  const filteredReminders = reminders.filter(r => `${clientName(r.clientId)} ${productName(r.productId)}`.toLowerCase().includes(search.toLowerCase()));

  function renderDashboard() {
    return <>
      <View style={styles.metrics}>
        <Metric label="Clientes" value={data.clients.length} />
        <Metric label="Pedidos no mês" value={monthOrders.length} />
        <Metric label="Vendas no mês" value={money(monthSales)} small />
        <Metric label="Contatos pendentes" value={reminders.length} />
      </View>
      <View style={styles.panel}>
        <SectionTitle title="Próximos contatos" right={<Text style={styles.muted}>{reminders.length} pendentes</Text>} />
        {reminders.slice(0, 4).map(item => <View style={styles.listRow} key={item.key}>
          <View style={{ flex: 1 }}><Text style={styles.rowTitle}>{clientName(item.clientId)}</Text><Text style={styles.muted}>{productName(item.productId)} · {dateBR(item.dueDate)}</Text></View>
          <AppButton title="Mensagem" variant="outline" compact onPress={() => shareMessage(item)} />
        </View>)}
        {!reminders.length && <Text style={styles.empty}>Nenhum contato pendente por enquanto.</Text>}
      </View>
      <View style={styles.panel}>
        <SectionTitle title="Atalhos" />
        <View style={styles.quickActions}>
          <AppButton title="+ Novo cliente" onPress={openNewClient} />
          <AppButton title="+ Registrar pedido" variant="secondary" onPress={openNewOrder} />
          <AppButton title="Ver contatos" variant="outline" onPress={() => { setTab("Contatos"); setSearch(""); }} />
        </View>
      </View>
      <View style={styles.panel}>
        <SectionTitle title="Pedidos recentes" />
        {data.orders.slice().sort((a,b) => b.date.localeCompare(a.date)).slice(0, 5).map(o => <View style={styles.listRow} key={o.id}>
          <View style={{ flex: 1 }}><Text style={styles.rowTitle}>{clientName(o.clientId)}</Text><Text style={styles.muted}>{productName(o.productId)} × {o.quantity} · {dateBR(o.date)}</Text></View>
          <View style={{ alignItems: "flex-end" }}><Text style={styles.rowTitle}>{money(o.quantity * o.price)}</Text><Pill text={o.status} tone={o.status === "Concluído" ? "green" : "amber"} /></View>
        </View>)}
      </View>
    </>;
  }
  function renderClients() {
    return <View style={styles.panel}>
      <SectionTitle title={`Minha carteira · ${filteredClients.length}`} right={<AppButton title="+ Cliente" onPress={openNewClient} compact />} />
      {filteredClients.map(c => {
        const last = data.orders.filter(o => o.clientId === c.id && o.status !== "Cancelado").sort((a,b) => b.date.localeCompare(a.date))[0];
        return <View style={styles.listRow} key={c.id}>
          <View style={{ flex: 1 }}><Text style={styles.rowTitle}>{c.name}</Text><Text style={styles.muted}>{c.phone} · Última compra: {last ? dateBR(last.date) : "sem compras"}</Text><Text style={styles.muted}>{c.preferences}</Text></View>
          <View style={styles.rowActions}><AppButton title="Editar" variant="outline" compact onPress={() => openEditClient(c)} /><AppButton title="Excluir" variant="danger" compact onPress={() => removeClient(c)} /></View>
        </View>;
      })}
      {!filteredClients.length && <Text style={styles.empty}>Nenhum cliente encontrado.</Text>}
    </View>;
  }
  function renderOrders() {
    return <View style={styles.panel}>
      <SectionTitle title={`Histórico · ${filteredOrders.length}`} right={<AppButton title="+ Pedido" onPress={openNewOrder} compact />} />
      {filteredOrders.map(o => <View style={styles.listRow} key={o.id}>
        <View style={{ flex: 1 }}><Text style={styles.rowTitle}>#{o.id} · {clientName(o.clientId)}</Text><Text style={styles.muted}>{productName(o.productId)} × {o.quantity} · {dateBR(o.date)}</Text></View>
        <View style={{ alignItems: "flex-end" }}><Text style={styles.rowTitle}>{money(o.quantity * o.price)}</Text><Pill text={o.status} tone={o.status === "Concluído" ? "green" : o.status === "Pendente" ? "amber" : "pink"} /></View>
      </View>)}
      {!filteredOrders.length && <Text style={styles.empty}>Nenhum pedido encontrado.</Text>}
    </View>;
  }
  function renderContacts() {
    return <View style={styles.panel}>
      <Text style={styles.notice}>As datas são estimativas com base no intervalo configurado para cada produto. Confirme a necessidade de reposição com o cliente.</Text>
      <SectionTitle title={`Clientes para contato · ${filteredReminders.length}`} />
      {filteredReminders.map(item => {
        const overdue = item.dueDate <= isoDate();
        return <View style={styles.contactCard} key={item.key}>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>{clientName(item.clientId)}</Text>
            <Text style={styles.muted}>{productName(item.productId)} · previsão {dateBR(item.dueDate)}</Text>
            <Pill text={overdue ? "Previsão atingida" : "Em breve"} tone={overdue ? "amber" : "pink"} />
          </View>
          <View style={styles.contactButtons}>
            <AppButton title="Mensagem" variant="outline" compact onPress={() => shareMessage(item)} />
            <AppButton title="Concluir" compact onPress={() => completeReminder(item)} />
          </View>
        </View>;
      })}
      {!filteredReminders.length && <Text style={styles.empty}>Tudo em dia! Nenhum contato pendente.</Text>}
    </View>;
  }

  const titles = {
    Painel: ["Olá, Rose! 👋", "Resumo da sua operação"],
    Clientes: ["Seus clientes", "Cadastre e organize sua carteira"],
    Pedidos: ["Pedidos", "Acompanhe as compras registradas"],
    Contatos: ["Lista de contatos", "Veja quem pode precisar de reposição"]
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
      <View style={styles.header}>
        <View style={styles.brandIcon}><Text style={{ fontSize: 23 }}>🌸</Text></View>
        <View style={{ flex: 1 }}><Text style={styles.brand}>Rose Vendas Inteligentes</Text><Text style={styles.muted}>MVP demonstrativo · Natura</Text></View>
        <TouchableOpacity onPress={resetDemo}><Text style={styles.reset}>Restaurar</Text></TouchableOpacity>
      </View>
      <View style={styles.pageHeading}><Text style={styles.eyebrow}>GESTÃO SIMPLES PARA VENDER MELHOR</Text><Text style={styles.title}>{titles[tab][0]}</Text><Text style={styles.muted}>{titles[tab][1]}</Text></View>
      {tab !== "Painel" && <TextInput value={search} onChangeText={setSearch} placeholder={`Buscar ${tab.toLowerCase()}...`} placeholderTextColor="#AA9FAA" style={styles.search} />}
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
        {tab === "Painel" ? renderDashboard() : tab === "Clientes" ? renderClients() : tab === "Pedidos" ? renderOrders() : renderContacts()}
        <Text style={styles.footer}>Dados fictícios para teste · Informações armazenadas neste aparelho</Text>
      </ScrollView>
      <View style={styles.tabBar}>
        {[
          ["Painel", "▦"], ["Clientes", "♙"], ["Pedidos", "▤"], ["Contatos", "◷"]
        ].map(([name, icon]) => <TouchableOpacity key={name} style={[styles.tab, tab === name && styles.tabActive]} onPress={() => { setTab(name); setSearch(""); }}>
          <Text style={[styles.tabIcon, tab === name && { color: COLORS.pink }]}>{icon}</Text>
          <Text style={[styles.tabText, tab === name && { color: COLORS.pink, fontWeight: "800" }]}>{name}</Text>
        </TouchableOpacity>)}
      </View>

      <Modal visible={clientModal} animationType="slide" transparent onRequestClose={() => setClientModal(false)}>
        <View style={styles.modalShade}><View style={styles.modal}>
          <Text style={styles.modalTitle}>{editingId ? "Editar cliente" : "Cadastrar cliente"}</Text>
          <ScrollView keyboardShouldPersistTaps="handled">
            <Field label="Nome completo *" value={clientForm.name} onChangeText={v => setClientForm(s => ({ ...s, name: v }))} placeholder="Ex.: Maria Oliveira" />
            <Field label="Telefone / WhatsApp *" value={clientForm.phone} onChangeText={v => setClientForm(s => ({ ...s, phone: v }))} placeholder="(21) 99999-9999" keyboardType="phone-pad" />
            <Field label="Aniversário (AAAA-MM-DD)" value={clientForm.birthday} onChangeText={v => setClientForm(s => ({ ...s, birthday: v }))} placeholder="1990-05-20" />
            <Field label="Preferências / interesses" value={clientForm.preferences} onChangeText={v => setClientForm(s => ({ ...s, preferences: v }))} placeholder="Perfumaria, cuidados com a pele..." />
            <Field label="Observações" value={clientForm.notes} onChangeText={v => setClientForm(s => ({ ...s, notes: v }))} placeholder="Informações úteis" multiline />
          </ScrollView>
          <View style={styles.modalActions}><AppButton title="Cancelar" variant="outline" onPress={() => setClientModal(false)} /><AppButton title="Salvar cliente" onPress={saveClient} /></View>
        </View></View>
      </Modal>

      <Modal visible={orderModal} animationType="slide" transparent onRequestClose={() => setOrderModal(false)}>
        <View style={styles.modalShade}><View style={styles.modal}>
          <Text style={styles.modalTitle}>Registrar pedido</Text>
          <ScrollView keyboardShouldPersistTaps="handled">
            <Text style={styles.label}>Cliente</Text>
            <ScrollView horizontal style={styles.choiceScroll}>{data.clients.map(c => <TouchableOpacity key={c.id} onPress={() => setOrderForm(s => ({ ...s, clientId: String(c.id) }))} style={[styles.choice, Number(orderForm.clientId) === c.id && styles.choiceActive]}><Text style={[styles.choiceText, Number(orderForm.clientId) === c.id && styles.choiceTextActive]}>{c.name}</Text></TouchableOpacity>)}</ScrollView>
            <Text style={styles.label}>Produto</Text>
            {data.products.map(p => <TouchableOpacity key={p.id} onPress={() => setOrderForm(s => ({ ...s, productId: String(p.id), price: String(p.price) }))} style={[styles.productChoice, Number(orderForm.productId) === p.id && styles.choiceActive]}>
              <Text style={[styles.choiceText, Number(orderForm.productId) === p.id && styles.choiceTextActive]}>{p.name} · {money(p.price)}</Text>
            </TouchableOpacity>)}
            <Field label="Quantidade" value={orderForm.quantity} onChangeText={v => setOrderForm(s => ({ ...s, quantity: v }))} keyboardType="numeric" />
            <Field label="Preço unitário (R$)" value={orderForm.price} onChangeText={v => setOrderForm(s => ({ ...s, price: v }))} keyboardType="decimal-pad" />
            <Field label="Data (AAAA-MM-DD)" value={orderForm.date} onChangeText={v => setOrderForm(s => ({ ...s, date: v }))} placeholder={isoDate()} />
            <Text style={styles.label}>Status</Text>
            <View style={styles.statusChoices}>{["Concluído", "Pendente", "Cancelado"].map(s => <TouchableOpacity key={s} onPress={() => setOrderForm(old => ({ ...old, status: s }))} style={[styles.choice, orderForm.status === s && styles.choiceActive]}><Text style={[styles.choiceText, orderForm.status === s && styles.choiceTextActive]}>{s}</Text></TouchableOpacity>)}</View>
          </ScrollView>
          <View style={styles.modalActions}><AppButton title="Cancelar" variant="outline" onPress={() => setOrderModal(false)} /><AppButton title="Salvar pedido" onPress={saveOrder} /></View>
        </View></View>
      </Modal>
    </SafeAreaView>
  );
}

function Metric({ label, value, small }) {
  return <View style={styles.metric}><Text style={styles.metricLabel}>{label}</Text><Text adjustsFontSizeToFit numberOfLines={1} style={[styles.metricValue, small && { fontSize: 17 }]}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg, paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.line, gap: 10 },
  brandIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: COLORS.pinkLight, alignItems: "center", justifyContent: "center" },
  brand: { color: COLORS.ink, fontWeight: "800", fontSize: 15 }, muted: { color: COLORS.muted, fontSize: 12, marginTop: 3 },
  reset: { color: COLORS.pink, fontWeight: "700", fontSize: 12 },
  pageHeading: { paddingHorizontal: 18, paddingTop: 19, paddingBottom: 12 },
  eyebrow: { color: COLORS.pink, fontSize: 10, fontWeight: "800", letterSpacing: 1.1 },
  title: { color: COLORS.ink, fontSize: 25, fontWeight: "800", marginTop: 4 },
  search: { backgroundColor: COLORS.white, borderColor: COLORS.line, borderWidth: 1, borderRadius: 11, marginHorizontal: 16, marginBottom: 8, paddingHorizontal: 13, paddingVertical: 10, color: COLORS.ink },
  content: { paddingHorizontal: 15, paddingBottom: 22 },
  metrics: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 12 },
  metric: { width: "48%", flexGrow: 1, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.line, borderRadius: 15, padding: 14 },
  metricLabel: { color: COLORS.muted, fontSize: 11 }, metricValue: { color: COLORS.ink, fontSize: 23, fontWeight: "800", marginTop: 7 },
  panel: { backgroundColor: COLORS.white, borderColor: COLORS.line, borderWidth: 1, borderRadius: 16, padding: 15, marginBottom: 12 },
  sectionTitle: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10, gap: 8 },
  sectionHeading: { color: COLORS.ink, fontSize: 16, fontWeight: "800" },
  listRow: { flexDirection: "row", alignItems: "center", paddingVertical: 11, borderTopWidth: 1, borderTopColor: "#F4EEF2", gap: 8 },
  rowTitle: { color: COLORS.ink, fontSize: 13, fontWeight: "750" },
  rowActions: { gap: 5 }, quickActions: { gap: 8 },
  button: { backgroundColor: COLORS.pink, paddingVertical: 11, paddingHorizontal: 14, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  buttonSecondary: { backgroundColor: COLORS.pinkLight }, buttonOutline: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.line },
  buttonDanger: { backgroundColor: "#FFF0F1" }, buttonText: { color: COLORS.white, fontWeight: "750", fontSize: 12 },
  buttonTextDark: { color: COLORS.ink }, buttonCompact: { paddingVertical: 7, paddingHorizontal: 10 },
  pill: { alignSelf: "flex-start", backgroundColor: COLORS.pinkLight, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 30, marginTop: 5 },
  pillGreen: { backgroundColor: "#E7F5ED" }, pillAmber: { backgroundColor: "#FFF3DC" },
  pillText: { color: "#A52F61", fontWeight: "750", fontSize: 10 },
  empty: { color: COLORS.muted, textAlign: "center", paddingVertical: 18, fontSize: 13 },
  notice: { color: "#805B1B", backgroundColor: "#FFF7E8", borderRadius: 10, padding: 11, fontSize: 12, marginBottom: 13 },
  contactCard: { flexDirection: "row", alignItems: "center", borderTopWidth: 1, borderTopColor: "#F4EEF2", paddingVertical: 12, gap: 8 },
  contactButtons: { gap: 6, alignItems: "stretch" },
  tabBar: { flexDirection: "row", backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.line, paddingTop: 7, paddingBottom: Platform.OS === "ios" ? 18 : 8 },
  tab: { flex: 1, alignItems: "center", paddingVertical: 5, gap: 2 }, tabActive: { backgroundColor: "#FFF8FB", borderRadius: 10 },
  tabIcon: { color: COLORS.muted, fontSize: 19 }, tabText: { color: COLORS.muted, fontSize: 10, fontWeight: "600" },
  footer: { color: COLORS.muted, fontSize: 10, textAlign: "center", paddingVertical: 12 },
  modalShade: { flex: 1, backgroundColor: "#24131F88", justifyContent: "flex-end" },
  modal: { maxHeight: "92%", backgroundColor: COLORS.white, borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 19 },
  modalTitle: { color: COLORS.ink, fontSize: 19, fontWeight: "800", marginBottom: 15 },
  field: { marginBottom: 12 }, label: { color: "#655965", fontSize: 12, fontWeight: "750", marginBottom: 6 },
  input: { borderWidth: 1, borderColor: COLORS.line, borderRadius: 10, paddingHorizontal: 11, paddingVertical: 10, color: COLORS.ink, backgroundColor: COLORS.white },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", gap: 8, paddingTop: 12 },
  choiceScroll: { maxHeight: 45, marginBottom: 12 }, choice: { paddingHorizontal: 10, paddingVertical: 9, borderWidth: 1, borderColor: COLORS.line, borderRadius: 9, marginRight: 7, marginBottom: 7 },
  choiceActive: { backgroundColor: COLORS.pinkLight, borderColor: "#E7A5BF" },
  choiceText: { color: COLORS.ink, fontSize: 11 }, choiceTextActive: { color: "#A52F61", fontWeight: "800" },
  productChoice: { padding: 10, borderWidth: 1, borderColor: COLORS.line, borderRadius: 9, marginBottom: 7 },
  statusChoices: { flexDirection: "row", flexWrap: "wrap", gap: 5, marginBottom: 12 }
});
