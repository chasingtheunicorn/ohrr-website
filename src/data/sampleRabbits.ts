import type { Rabbit } from '../lib/types'

// Fallback shown until OHRR adds rabbits in the app's staff tools — then the live
// list replaces these automatically (same data source as the app).
export const sampleRabbits: Rabbit[] = [
  { id: 's-clover', name: 'Clover', age: 'Young', sex: 'Female', breed: 'Mini Lop', photo: '/img/bunny-lop-caramel.jpg', description: 'A sweet, people-loving lop — already litter-trained.' },
  { id: 's-basil', name: 'Basil', age: 'Adult', sex: 'Male', breed: 'Lionhead mix', photo: '/img/bunny-lionhead-white.jpg', description: 'A laid-back gentleman who loves a good chin rub.' },
  { id: 's-hazel', name: 'Hazel & Juniper', age: 'Adult', sex: 'Female', breed: 'Dutch', bonded: true, photo: '/img/bunny-spotted.jpg', description: 'A deeply bonded pair of sisters, adopted together.' },
  { id: 's-pip', name: 'Pip', age: 'Baby', sex: 'Male', breed: 'Netherland Dwarf', photo: '/img/bunny-grey-dwarf.jpg', description: 'A pint-sized bundle of binky energy.' },
  { id: 's-willow', name: 'Willow', age: 'Senior', sex: 'Female', breed: 'Rex', photo: '/img/bunny-silver.jpg', description: 'A velvety senior girl with the softest coat.' },
  { id: 's-tango', name: 'Tango', age: 'Adult', sex: 'Male', breed: 'Lop', photo: '/img/bunny-lop-orange.jpg', description: 'A mellow lop who just wants company.' },
]
