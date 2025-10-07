<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header con información del espacio -->
    <div class="mb-8">
      <div class="flex items-center mb-4">
        <button @click="goBack" class="text-gray-400 hover:text-gray-600 mr-4">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Inventario - {{ space.name }}</h1>
          <div class="flex items-center mt-2 text-sm text-gray-600">
            <span :class="getTypeIconClass(space.type)" class="w-4 h-4 mr-2"></span>
            <span class="capitalize mr-4">{{ getTypeLabel(space.type) }}</span>
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            </svg>
            <span>{{ space.location || 'Sin ubicación' }}</span>
          </div>
        </div>
      </div>

      <!-- Estadísticas del inventario -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-lg shadow p-4">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Equipos</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalEquipment }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-4">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">En Buen Estado</p>
              <p class="text-2xl font-bold text-gray-900">{{ goodConditionCount }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-4">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 rounded-lg">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Necesita Atención</p>
              <p class="text-2xl font-bold text-gray-900">{{ needsAttentionCount }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-4">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Valor Total</p>
              <p class="text-2xl font-bold text-gray-900">${{ formatCurrency(totalValue) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Acciones principales -->
      <div class="flex justify-between items-center">
        <div class="flex gap-3">
          <button
            @click="openAddEquipmentModal"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Agregar Equipo
          </button>
          <button
            @click="exportInventory"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
            </svg>
            Exportar
          </button>
          <button
            @click="generateSpaceQR"
            class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
            </svg>
            QR del Espacio
          </button>
        </div>
      </div>
    </div>

    <!-- Filtros -->
    <div class="bg-white shadow rounded-lg p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Nombre del equipo..."
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
          <select
            v-model="filterCategory"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Todas las categorías</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select
            v-model="filterStatus"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
            <option value="prestado">Prestado</option>
            <option value="mantenimiento">Mantenimiento</option>
            <option value="baja">Dado de Baja</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Condición</label>
          <select
            v-model="filterCondition"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Todas las condiciones</option>
            <option value="excelente">Excelente</option>
            <option value="bueno">Bueno</option>
            <option value="regular">Regular</option>
            <option value="malo">Malo</option>
            <option value="fuera_servicio">Fuera de Servicio</option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            @click="loadInventory"
            class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Actualizar
          </button>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error state -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
      <div class="flex">
        <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
        </svg>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error</h3>
          <div class="mt-2 text-sm text-red-700">{{ error }}</div>
        </div>
      </div>
    </div>

    <!-- Tabla de inventario -->
    <div v-if="!loading && !error" class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipo</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condición</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="equipment in filteredEquipment" :key="equipment.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <div :class="getCategoryColor(equipment.category_id)" class="h-10 w-10 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ equipment.name }}</div>
                  <div class="text-sm text-gray-500">
                    {{ equipment.brand }} {{ equipment.model }}
                  </div>
                  <div v-if="equipment.serial_number" class="text-xs text-gray-400">
                    S/N: {{ equipment.serial_number }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                    :class="getCategoryBadgeClass(equipment.category_id)">
                {{ getCategoryName(equipment.category_id) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getStatusBadgeClass(equipment.status)" 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize">
                {{ equipment.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getConditionBadgeClass(equipment.condition_status)" 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize">
                {{ getConditionLabel(equipment.condition_status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ equipment.quantity }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <div v-if="equipment.purchase_price">
                ${{ formatCurrency(equipment.purchase_price * equipment.quantity) }}
                <div class="text-xs text-gray-500">
                  (${{ formatCurrency(equipment.purchase_price) }} c/u)
                </div>
              </div>
              <span v-else class="text-gray-400">N/A</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex items-center gap-2">
                <button
                  @click="editEquipment(equipment)"
                  class="text-blue-600 hover:text-blue-900"
                  title="Editar"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button
                  @click="viewEquipmentHistory(equipment)"
                  class="text-green-600 hover:text-green-900"
                  title="Historial"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                </button>
                <button
                  @click="generateEquipmentQR(equipment)"
                  class="text-purple-600 hover:text-purple-900"
                  title="Generar QR"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
                  </svg>
                </button>
                <button
                  @click="deleteEquipment(equipment)"
                  class="text-red-600 hover:text-red-900"
                  title="Eliminar"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Estado vacío -->
      <div v-if="filteredEquipment.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No hay equipos registrados</h3>
        <p class="mt-1 text-sm text-gray-500">Comienza agregando el primer equipo a este espacio.</p>
        <div class="mt-6">
          <button
            @click="openAddEquipmentModal"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
          >
            Agregar Primer Equipo
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de agregar/editar equipo -->
    <div v-if="showEquipmentModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white max-h-screen overflow-y-auto">
        <div class="mt-3">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-medium text-gray-900">
              {{ isEditingEquipment ? 'Editar' : 'Agregar' }} Equipo
            </h3>
            <button @click="closeEquipmentModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <form @submit.prevent="saveEquipment">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Información básica -->
              <div class="md:col-span-2">
                <h4 class="text-md font-medium text-gray-900 mb-3">Información Básica</h4>
              </div>

              <!-- Nombre -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del equipo *</label>
                <input
                  v-model="equipmentForm.name"
                  type="text"
                  required
                  placeholder="Ej: Mesa de trabajo, Computadora Dell, Proyector Epson"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
              </div>

              <!-- Categoría -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
                <select
                  v-model="equipmentForm.category_id"
                  required
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Seleccionar categoría</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>

              <!-- Marca -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                <input
                  v-model="equipmentForm.brand"
                  type="text"
                  placeholder="Ej: Dell, HP, Epson"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
              </div>

              <!-- Modelo -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                <input
                  v-model="equipmentForm.model"
                  type="text"
                  placeholder="Ej: OptiPlex 3080, PowerLite 2042"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
              </div>

              <!-- Número de serie -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Número de serie</label>
                <input
                  v-model="equipmentForm.serial_number"
                  type="text"
                  placeholder="Número de serie o identificador único"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
              </div>

              <!-- Cantidad -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Cantidad *</label>
                <input
                  v-model.number="equipmentForm.quantity"
                  type="number"
                  required
                  min="1"
                  placeholder="1"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
              </div>

              <!-- Estado y condición -->
              <div class="md:col-span-2">
                <h4 class="text-md font-medium text-gray-900 mb-3 mt-6">Estado y Condición</h4>
              </div>

              <!-- Estado -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  v-model="equipmentForm.status"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                  <option value="prestado">Prestado</option>
                  <option value="mantenimiento">En Mantenimiento</option>
                  <option value="baja">Dado de Baja</option>
                </select>
              </div>

              <!-- Condición -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Condición</label>
                <select
                  v-model="equipmentForm.condition_status"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="excelente">Excelente</option>
                  <option value="bueno">Bueno</option>
                  <option value="regular">Regular</option>
                  <option value="malo">Malo</option>
                  <option value="fuera_servicio">Fuera de Servicio</option>
                </select>
              </div>

              <!-- Información financiera -->
              <div class="md:col-span-2">
                <h4 class="text-md font-medium text-gray-900 mb-3 mt-6">Información Financiera (Opcional)</h4>
              </div>

              <!-- Fecha de compra -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de compra</label>
                <input
                  v-model="equipmentForm.purchase_date"
                  type="date"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
              </div>

              <!-- Precio de compra -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Precio de compra (por unidad)</label>
                <input
                  v-model.number="equipmentForm.purchase_price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
              </div>

              <!-- Garantía -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Vencimiento de garantía</label>
                <input
                  v-model="equipmentForm.warranty_expiry"
                  type="date"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
              </div>

              <!-- Mantenimiento -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Programa de mantenimiento</label>
                <select
                  v-model="equipmentForm.maintenance_schedule"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="ninguno">Sin mantenimiento programado</option>
                  <option value="semanal">Semanal</option>
                  <option value="mensual">Mensual</option>
                  <option value="trimestral">Trimestral</option>
                  <option value="semestral">Semestral</option>
                  <option value="anual">Anual</option>
                </select>
              </div>

              <!-- Código de barras -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Código de barras</label>
                <input
                  v-model="equipmentForm.barcode"
                  type="text"
                  placeholder="Código de barras del equipo"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
              </div>

              <!-- Descripción -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Descripción/Notas</label>
                <textarea
                  v-model="equipmentForm.description"
                  rows="3"
                  placeholder="Descripción detallada, características especiales, observaciones..."
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>

            <div class="flex justify-end gap-3 mt-6">
              <button
                type="button"
                @click="closeEquipmentModal"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {{ saving ? 'Guardando...' : (isEditingEquipment ? 'Actualizar' : 'Agregar') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Estados reactivos
const space = ref({})
const equipment = ref([])
const categories = ref([])
const loading = ref(false)
const error = ref('')
const searchTerm = ref('')
const filterCategory = ref('')
const filterStatus = ref('')
const filterCondition = ref('')

// Modal de equipo
const showEquipmentModal = ref(false)
const isEditingEquipment = ref(false)
const saving = ref(false)

// Formulario de equipo
const equipmentForm = ref({
  id: null,
  name: '',
  category_id: '',
  brand: '',
  model: '',
  serial_number: '',
  quantity: 1,
  status: 'activo',
  condition_status: 'bueno',
  purchase_date: '',
  purchase_price: null,
  warranty_expiry: '',
  maintenance_schedule: 'ninguno',
  barcode: '',
  description: ''
})

// API configuration
const API_BASE = 'http://localhost:3001/api'
const spaceId = route.params.id

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  }
}

// Computed properties
const filteredEquipment = computed(() => {
  return equipment.value.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                         (item.brand && item.brand.toLowerCase().includes(searchTerm.value.toLowerCase())) ||
                         (item.model && item.model.toLowerCase().includes(searchTerm.value.toLowerCase()))
    const matchesCategory = !filterCategory.value || item.category_id == filterCategory.value
    const matchesStatus = !filterStatus.value || item.status === filterStatus.value
    const matchesCondition = !filterCondition.value || item.condition_status === filterCondition.value
    
    return matchesSearch && matchesCategory && matchesStatus && matchesCondition
  })
})

const totalEquipment = computed(() => {
  return equipment.value.reduce((sum, item) => sum + item.quantity, 0)
})

const goodConditionCount = computed(() => {
  return equipment.value
    .filter(item => ['excelente', 'bueno'].includes(item.condition_status))
    .reduce((sum, item) => sum + item.quantity, 0)
})

const needsAttentionCount = computed(() => {
  return equipment.value
    .filter(item => ['malo', 'fuera_servicio'].includes(item.condition_status))
    .reduce((sum, item) => sum + item.quantity, 0)
})

const totalValue = computed(() => {
  return equipment.value.reduce((sum, item) => {
    return sum + (item.purchase_price ? item.purchase_price * item.quantity : 0)
  }, 0)
})

// Utility functions
const getTypeLabel = (type) => {
  const labels = {
    'aula': 'Aula',
    'cubiculo': 'Cubículo',
    'laboratorio': 'Laboratorio',
    'oficina': 'Oficina',
    'sala_juntas': 'Sala de Juntas',
    'otro': 'Otro'
  }
  return labels[type] || type
}

const getTypeIconClass = (type) => {
  const icons = {
    'aula': 'text-blue-500',
    'cubiculo': 'text-green-500',
    'laboratorio': 'text-purple-500',
    'oficina': 'text-yellow-500',
    'sala_juntas': 'text-red-500',
    'otro': 'text-gray-500'
  }
  return icons[type] || 'text-gray-500'
}

const getCategoryName = (categoryId) => {
  const category = categories.value.find(c => c.id == categoryId)
  return category ? category.name : 'Sin categoría'
}

const getCategoryColor = (categoryId) => {
  const category = categories.value.find(c => c.id == categoryId)
  return category ? `bg-${category.color}` : 'bg-gray-500'
}

const getCategoryBadgeClass = (categoryId) => {
  const category = categories.value.find(c => c.id == categoryId)
  if (!category) return 'bg-gray-100 text-gray-800'
  
  // Simplificar a colores básicos para los badges
  const colorMap = {
    '#8B5CF6': 'bg-purple-100 text-purple-800',
    '#3B82F6': 'bg-blue-100 text-blue-800',
    '#EF4444': 'bg-red-100 text-red-800',
    '#F59E0B': 'bg-yellow-100 text-yellow-800',
    '#10B981': 'bg-green-100 text-green-800',
    '#6B7280': 'bg-gray-100 text-gray-800'
  }
  
  return colorMap[category.color] || 'bg-gray-100 text-gray-800'
}

const getStatusBadgeClass = (status) => {
  const classes = {
    'activo': 'bg-green-100 text-green-800',
    'inactivo': 'bg-red-100 text-red-800',
    'prestado': 'bg-blue-100 text-blue-800',
    'mantenimiento': 'bg-yellow-100 text-yellow-800',
    'baja': 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getConditionBadgeClass = (condition) => {
  const classes = {
    'excelente': 'bg-green-100 text-green-800',
    'bueno': 'bg-blue-100 text-blue-800',
    'regular': 'bg-yellow-100 text-yellow-800',
    'malo': 'bg-red-100 text-red-800',
    'fuera_servicio': 'bg-gray-100 text-gray-800'
  }
  return classes[condition] || 'bg-gray-100 text-gray-800'
}

const getConditionLabel = (condition) => {
  const labels = {
    'excelente': 'Excelente',
    'bueno': 'Bueno',
    'regular': 'Regular',
    'malo': 'Malo',
    'fuera_servicio': 'Fuera de Servicio'
  }
  return labels[condition] || condition
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-MX').format(amount)
}

// API functions
const loadSpace = async () => {
  try {
    const response = await fetch(`${API_BASE}/spaces/${spaceId}`, {
      headers: getAuthHeaders()
    })
    
    if (!response.ok) {
      throw new Error('Error al cargar información del espacio')
    }
    
    const data = await response.json()
    space.value = data.data || data
  } catch (err) {
    error.value = 'Error al cargar espacio: ' + err.message
    console.error('Error loading space:', err)
  }
}

const loadInventory = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await fetch(`${API_BASE}/spaces/${spaceId}/equipment`, {
      headers: getAuthHeaders()
    })
    
    if (!response.ok) {
      throw new Error('Error al cargar inventario')
    }
    
    const data = await response.json()
    equipment.value = data.data || []
  } catch (err) {
    error.value = 'Error al cargar inventario: ' + err.message
    console.error('Error loading inventory:', err)
  } finally {
    loading.value = false
  }
}

const loadCategories = async () => {
  try {
    const response = await fetch(`${API_BASE}/equipment-categories`, {
      headers: getAuthHeaders()
    })
    
    if (!response.ok) return
    
    const data = await response.json()
    categories.value = data.data || []
  } catch (err) {
    console.error('Error loading categories:', err)
  }
}

// Modal functions
const openAddEquipmentModal = () => {
  resetEquipmentForm()
  isEditingEquipment.value = false
  showEquipmentModal.value = true
}

const editEquipment = (item) => {
  equipmentForm.value = { ...item }
  isEditingEquipment.value = true
  showEquipmentModal.value = true
}

const closeEquipmentModal = () => {
  showEquipmentModal.value = false
  resetEquipmentForm()
}

const resetEquipmentForm = () => {
  equipmentForm.value = {
    id: null,
    name: '',
    category_id: '',
    brand: '',
    model: '',
    serial_number: '',
    quantity: 1,
    status: 'activo',
    condition_status: 'bueno',
    purchase_date: '',
    purchase_price: null,
    warranty_expiry: '',
    maintenance_schedule: 'ninguno',
    barcode: '',
    description: ''
  }
}

const saveEquipment = async () => {
  saving.value = true
  
  try {
    const url = isEditingEquipment.value 
      ? `${API_BASE}/equipment/${equipmentForm.value.id}`
      : `${API_BASE}/spaces/${spaceId}/equipment`
    
    const method = isEditingEquipment.value ? 'PUT' : 'POST'
    
    const response = await fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify({
        ...equipmentForm.value,
        space_id: spaceId
      })
    })
    
    if (!response.ok) {
      throw new Error('Error al guardar equipo')
    }
    
    closeEquipmentModal()
    loadInventory()
  } catch (err) {
    error.value = 'Error al guardar equipo: ' + err.message
  } finally {
    saving.value = false
  }
}

const deleteEquipment = async (item) => {
  if (!confirm(`¿Estás seguro de eliminar "${item.name}"? Esta acción no se puede deshacer.`)) {
    return
  }
  
  try {
    const response = await fetch(`${API_BASE}/equipment/${item.id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    
    if (!response.ok) {
      throw new Error('Error al eliminar equipo')
    }
    
    loadInventory()
  } catch (err) {
    error.value = 'Error al eliminar equipo: ' + err.message
  }
}

// Action functions
const goBack = () => {
  router.go(-1)
}

const exportInventory = () => {
  // TODO: Implementar exportación a Excel/PDF
  alert('Exportando inventario...')
}

const generateSpaceQR = () => {
  // TODO: Implementar generación de QR del espacio
  alert(`Generando QR del espacio: ${space.value.name}`)
}

const generateEquipmentQR = (item) => {
  // TODO: Implementar generación de QR del equipo
  alert(`Generando QR del equipo: ${item.name}`)
}

const viewEquipmentHistory = (item) => {
  // TODO: Implementar vista de historial de mantenimiento
  alert(`Mostrando historial de: ${item.name}`)
}

// Lifecycle
onMounted(() => {
  loadSpace()
  loadInventory()
  loadCategories()
})
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>