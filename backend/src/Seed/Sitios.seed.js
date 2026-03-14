// =============================================
// seed/sitios.seed.js  –  Gigante Viajero
// Ejecutar: node src/seed/sitios.seed.js
// =============================================

require('dotenv').config();
const mongoose = require('mongoose');
const Sitio    = require('../models/Sitio');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI
    || 'mongodb://localhost:27017/gigante_viajero';

const sitios = [
    // ── 1. BRISAS DE MIRTHAYÚ ─────────────────
    {
        nombre:     'Brisas de Mirthayú',
        slug:       'brisas-de-mirthayu',
        categorias: ['parque', 'hospedaje'],
        descripcion: 'Finca agroturística a 7 km de Gigante vía Zuluaga. Escultura de la Diosa Mirthayú, piscina al aire libre, hidropedales, cabalgatas y mirador panorámico a la Represa del Quimbo.',
        ubicacion: {
            municipio:    'Gigante',
            departamento: 'Huila',
            referencia:   'Vía Zuluaga, 7 km del municipio de Gigante',
            coordenadas:  { lat: 2.3689, lng: -75.5501 }
        },
        entrada:    { precio: 5000, notas: 'Piscina adicional $7.000' },
        atracciones: [
            'Escultura de Mirthayú', 'Pie de Gigante Matambo', 'Puente Panorámico',
            'Arcoíris de Brisas', 'Duo de Corazones', 'Piscina al Aire Libre',
            'Hidropedales', 'Cabalgatas Guiadas', 'Senderismo Natural',
            'Zonas Fotográficas', 'Mirador Panorámico', 'Restaurante Típico'
        ],
        servicios:    ['Restaurante típico', 'Bar y bebidas', 'Parqueadero gratis', 'WiFi', 'Zonas verdes'],
        alojamientos: [
            { nombre: 'Cabaña Familiar', tipo: 'cabaña', capacidadMax: 4,
              precios: [{ descripcion: 'Por noche', precio: 80000 }] },
            { nombre: 'Cabaña Pareja',   tipo: 'cabaña', capacidadMax: 2,
              precios: [{ descripcion: 'Por noche', precio: 200000 }] }
        ],
        horario:           '9:00 AM – 6:00 PM',
        petFriendly:       true,
        precioBaseReserva: 80000,
        imagen:            '../assets/img/brisa_marthayu.jpg',
        mapCategoria:      'aventura',
        mapTipo:           'Aventura',
        mapIcono:          '🏞️',
        paginaDetalle:     'Brisas de Mirthayu.html'
    },

    // ── 2. XHIMANUT ───────────────────────────
    {
        nombre:     'Xhimanut - Parque de los Sueños',
        slug:       'xhimanut',
        categorias: ['parque', 'hospedaje'],
        descripcion: 'Parque temático con +30 atracciones, cine acuático y senderos ecológicos. Cabañas para hospedaje.',
        ubicacion: {
            municipio:    'Gigante',
            departamento: 'Huila',
            referencia:   'Gigante, Huila',
            coordenadas:  { lat: 2.3612, lng: -75.5523 }
        },
        entrada:    { precio: 12000 },
        alojamientos: [
            { nombre: 'Cabaña A', tipo: 'cabaña', capacidadMax: 4,
              precios: [{ descripcion: 'Por noche', precio: 420000 }] },
            { nombre: 'Cabaña B', tipo: 'cabaña', capacidadMax: 4,
              precios: [{ descripcion: 'Por noche', precio: 390000 }] }
        ],
        precioBaseReserva: 35000,
        imagen:        '../assets/img/parque_xhimnaut_123.jpg',
        mapCategoria:  'naturaleza',
        mapTipo:       'Naturaleza',
        mapIcono:      '🌊',
        paginaDetalle: 'xhimanut.html'
    },

    // ── 3. LOS PINOS ──────────────────────────
    {
        nombre:     'Los Pinos - Parque Agroecoturístico',
        slug:       'los-pinos',
        categorias: ['parque', 'glamping', 'hospedaje'],
        descripcion: 'Eco hotel sustentable en bosque de pinos. Entrada incluye almuerzo. Glamping y múltiples cabañas.',
        ubicacion: {
            municipio:    'Gigante',
            departamento: 'Huila',
            referencia:   'Hobo – Gigante, Huila',
            coordenadas:  { lat: 2.3667, lng: -75.5556 }
        },
        entrada: { precio: 48000, incluyeAlmuerzo: true, notas: 'Incluye almuerzo' },
        alojamientos: [
            { nombre: 'Glamping VIP',      tipo: 'glamping', precios: [{ descripcion: '1 persona', precio: 540000 }, { descripcion: '2 personas', precio: 675000 }] },
            { nombre: 'Alpino Confort',    tipo: 'cabaña',   precios: [{ descripcion: '1 persona', precio: 424000 }, { descripcion: '2 personas', precio: 530000 }] },
            { nombre: 'Alpino Esencial',   tipo: 'cabaña',   precios: [{ descripcion: '1 persona', precio: 264000 }, { descripcion: '2 personas', precio: 330000 }] },
            { nombre: 'Alpino Prime',      tipo: 'cabaña',   capacidadMax: 6,
              precios: [{ descripcion: '1-3 personas', precio: 510000 }, { descripcion: '4 personas', precio: 680000 }, { descripcion: '5 personas', precio: 850000 }, { descripcion: '6 personas', precio: 1020000 }] },
            { nombre: 'Cabaña El Aprisco', tipo: 'cabaña',   capacidadMax: 12,
              precios: [{ descripcion: '1-6 personas', precio: 870000 }, { descripcion: '7 personas', precio: 1015000 }, { descripcion: '8 personas', precio: 1160000 }, { descripcion: '12 personas', precio: 1740000 }] },
            { nombre: 'Alpino Plus',       tipo: 'cabaña',   capacidadMax: 6,
              precios: [{ descripcion: '1-3 personas', precio: 510000 }, { descripcion: '4 personas', precio: 680000 }, { descripcion: '6 personas', precio: 1020000 }] }
        ],
        precioBaseReserva: 180000,
        imagen:        '../assets/img/los_pinos.jpg',
        mapCategoria:  'naturaleza',
        mapTipo:       'Naturaleza',
        mapIcono:      '🌲',
        paginaDetalle: 'Los Pinos.html'
    },

    // ── 4. LA MANO DEL GIGANTE ────────────────
    {
        nombre:     'La Mano del Gigante',
        slug:       'mano-del-gigante',
        categorias: ['mirador', 'hospedaje'],
        descripcion: 'Mirador icónico con deslizador de 210m y columpio sobre el barranco. Cabañas temáticas con nombres de aves locales.',
        ubicacion: {
            municipio:    'Gigante',
            departamento: 'Huila',
            referencia:   'Vereda El Rodeo, Gigante, Huila',
            coordenadas:  { lat: 2.3736, lng: -75.5437 }
        },
        entrada: { precio: 15000 },
        alojamientos: [
            { nombre: 'Cabaña Celeste Pareja',     tipo: 'cabaña', capacidadMax: 2,
              precios: [{ descripcion: 'Por noche', precio: 280000 }] },
            { nombre: 'Cabaña Celeste Familiar 3', tipo: 'cabaña', capacidadMax: 3,
              precios: [{ descripcion: '3 personas', precio: 380000 }] },
            { nombre: 'Cabaña Celeste Familiar 4', tipo: 'cabaña', capacidadMax: 4,
              precios: [{ descripcion: '4 personas', precio: 480000 }] },
            { nombre: 'Cabaña Azulejo',  tipo: 'cabaña', capacidadMax: 6,
              precios: [{ descripcion: 'Lunes-jueves', precio: 580000 }, { descripcion: 'Viernes-festivos', precio: 780000 }] },
            { nombre: 'Cabaña Cardenal', tipo: 'cabaña', capacidadMax: 6,
              precios: [{ descripcion: 'Lunes-jueves', precio: 580000 }, { descripcion: 'Viernes-festivos', precio: 780000 }] },
            { nombre: 'Cabaña Turpial',  tipo: 'cabaña', capacidadMax: 6,
              precios: [{ descripcion: 'Lunes-jueves', precio: 658000 }, { descripcion: 'Viernes-festivos', precio: 780000 }] },
            { nombre: 'Cabaña Colibrí',  tipo: 'cabaña', capacidadMax: 8,
              precios: [{ descripcion: 'Lunes-jueves', precio: 1300000 }, { descripcion: 'Viernes-festivos', precio: 1500000 }] }
        ],
        precioBaseReserva: 21000,
        imagen:        '../assets/img/la_mano_gigante_fondo.jpg',
        mapCategoria:  'miradores',
        mapTipo:       'Mirador',
        mapIcono:      '✋',
        paginaDetalle: 'Mano del Gigante.html'
    },

    // ── 5. LA LOMA DE LA CRUZ ─────────────────
    {
        nombre:     'La Loma de la Cruz',
        slug:       'loma-de-la-cruz',
        categorias: ['mirador'],
        descripcion: 'Mirador natural con vista 360° del Valle del Magdalena. Acceso gratuito.',
        ubicacion: {
            municipio:    'Gigante',
            departamento: 'Huila',
            referencia:   'Gigante, Huila',
            coordenadas:  { lat: 2.3810, lng: -75.5460 }
        },
        entrada:           { precio: 0 },
        alojamientos:      [],
        precioBaseReserva: 0,
        imagen:        '../assets/img/loma_cruz_gigante.jpg',
        mapCategoria:  'miradores',
        mapTipo:       'Mirador',
        mapIcono:      '✝️',
        paginaDetalle: '#'
    },

    // ── 6. LA MORRA ───────────────────────────
    {
        nombre:     'La Morra - Mirador 360°',
        slug:       'la-morra',
        categorias: ['mirador', 'glamping'],
        descripcion: 'Vistas al Nevado del Huila, Puracé y represas del Quimbo. Glamping romántico con jacuzzi disponible.',
        ubicacion: {
            municipio:    'Gigante',
            departamento: 'Huila',
            referencia:   'Cordillera Oriental, Gigante, Huila',
            coordenadas:  { lat: 2.3845, lng: -75.5412 }
        },
        entrada: { precio: 10000 },
        alojamientos: [
            { nombre: 'Glamping de Pareja', tipo: 'glamping', capacidadMax: 2,
              precios: [{ descripcion: 'Por noche', precio: 250000 }] }
        ],
        precioBaseReserva: 15000,
        imagen:        '../assets/img/la_morra.jpg',
        mapCategoria:  'miradores',
        mapTipo:       'Mirador',
        mapIcono:      '🏔️',
        paginaDetalle: 'La Morra.html'
    },

    // ── 7. LA CASA DEL ÁRBOL ──────────────────
    {
        nombre:     'La Casa del Árbol',
        slug:       'la-casita-del-arbol',
        categorias: ['mirador'],
        descripcion: 'Mirador en árbol con cascada, canoa y senderismo ecológico. Solo visitas de día.',
        ubicacion: {
            municipio:    'Gigante',
            departamento: 'Huila',
            referencia:   'Gigante, Huila',
            coordenadas:  { lat: 2.3723, lng: -75.5478 }
        },
        entrada:           { precio: 8000 },
        alojamientos:      [],
        precioBaseReserva: 10000,
        imagen:        '../assets/img/la_casa_arbol.jpg',
        mapCategoria:  'aventura',
        mapTipo:       'Aventura',
        mapIcono:      '🌳',
        paginaDetalle: 'La casa del arbol.html'
    },

    // ── 8. LA PERLA FINCA HOTEL ───────────────
    {
        nombre:     'La Perla Finca Hotel',
        slug:       'la-perla',
        categorias: ['hospedaje'],
        descripcion: 'Hotel boutique en Ruta del Café con cabañas de lujo entre cafetales. Cada alojamiento lleva nombre de piedra preciosa.',
        ubicacion: {
            municipio:    'Gigante',
            departamento: 'Huila',
            referencia:   'Vereda Bajo Corozal, Gigante, Huila',
            coordenadas:  { lat: 2.3798, lng: -75.5389 }
        },
        entrada: { precio: 6000 },
        alojamientos: [
            { nombre: 'Cabaña ZAFIRO',            tipo: 'cabaña',   precios: [{ descripcion: 'Por noche', precio: 1750000 }] },
            { nombre: 'Cabaña JASPE',             tipo: 'cabaña',   precios: [{ descripcion: 'Por noche', precio: 990000  }] },
            { nombre: 'Glamping CRISOLITO',        tipo: 'glamping', precios: [{ descripcion: 'Por noche', precio: 1100000 }] },
            { nombre: 'Cabaña AGATA',             tipo: 'cabaña',   precios: [{ descripcion: 'Por noche', precio: 1100000 }] },
            { nombre: 'Glamping CORNALINA',        tipo: 'glamping', precios: [{ descripcion: 'Por noche', precio: 1100000 }] },
            { nombre: 'Cabaña Familiar JACINTO',  tipo: 'cabaña',   precios: [{ descripcion: 'Por noche', precio: 1150000 }] },
            { nombre: 'Cabaña Familiar AMATISTA', tipo: 'cabaña',   precios: [{ descripcion: 'Por noche', precio: 1200000 }] },
            { nombre: 'Cabaña ESMERALDA',         tipo: 'cabaña',   precios: [{ descripcion: 'Por noche', precio: 1200000 }] },
            { nombre: 'Cabaña Familiar CRISTAL',  tipo: 'cabaña',   precios: [{ descripcion: 'Por noche', precio: 1100000 }] }
        ],
        precioBaseReserva: 280000,
        imagen:        '../assets/img/perla_finca_gigante.jpg',
        mapCategoria:  'gastronomia',
        mapTipo:       'Hospedaje',
        mapIcono:      '🏡',
        paginaDetalle: 'La Perla.html'
    }
];

// ── Ejecutar ──────────────────────────────────
async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Conectado a MongoDB');

        for (const data of sitios) {
            const result = await Sitio.findOneAndUpdate(
                { slug: data.slug },
                data,
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            console.log(`   ✔  ${result.nombre}`);
        }

        console.log(`\n🎉 ${sitios.length} sitios insertados/actualizados correctamente.`);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Desconectado.');
    }
}

seed();