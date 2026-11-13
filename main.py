import flet as ft
import json


class InstruccionPunto:
    def __init__(self, tipo_punto: str, cantidad: int = 1):
        self.tipo_punto = tipo_punto
        self.cantidad = int(cantidad)

    def calcular_puntos_totales(self) -> int:
        if "Aumento" in self.tipo_punto or "Doble" in self.tipo_punto:
            return self.cantidad * 2
        elif "Disminución" in self.tipo_punto:
            return self.cantidad * 1
        return self.cantidad

    def a_texto(self) -> str:
        return f"{self.cantidad} {self.tipo_punto}"

    def to_dict(self):
        return {"tipo_punto": self.tipo_punto, "cantidad": self.cantidad}


class GrupoRepeticion:
    def __init__(self, repeticiones: int = 1):
        self.repeticiones = int(repeticiones)
        self.elementos = []  # Lista de InstruccionPunto

    def agregar_elemento(self, elemento):
        self.elementos.append(elemento)

    def calcular_puntos_totales(self) -> int:
        subtotal = sum(el.calcular_puntos_totales() for el in self.elementos)
        return subtotal * self.repeticiones

    def a_texto(self) -> str:
        contenido = ", ".join([el.a_texto() for el in self.elementos])
        return f"[{contenido}] x {self.repeticiones}"

    def to_dict(self):
        return {
            "repeticiones": self.repeticiones,
            "elementos": [el.to_dict() for el in self.elementos]
        }


class Vuelta:
    def __init__(self, numero: int):
        self.numero = numero
        self.instrucciones = []

    def agregar_instruccion(self, inst):
        self.instrucciones.append(inst)

    def total_puntos(self) -> int:
        return sum(inst.calcular_puntos_totales() for inst in self.instrucciones)

    def a_texto(self) -> str:
        texto_instrucciones = ", ".join([inst.a_texto() for inst in self.instrucciones])
        return f"V{self.numero}: {texto_instrucciones} ({self.total_puntos()} pts)"

    def to_dict(self):
        return {
            "numero": self.numero,
            "instrucciones": [inst.to_dict() for inst in self.instrucciones]
        }


class Pieza:
    def __init__(self, nombre: str):
        self.nombre = nombre
        self.vueltas = []
        self.marcadores = []

    def agregar_vuelta(self, vuelta: Vuelta):
        self.vueltas.append(vuelta)

    def eliminar_vuelta(self, index: int):
        del self.vueltas[index]
        for i, v in enumerate(self.vueltas):
            v.numero = i + 1


def main(page: ft.Page):
    page.title = "Crostep - Diseñador de Patrones"
    page.theme_mode = ft.ThemeMode.LIGHT
    page.scroll = ft.ScrollMode.AUTO

    pieza_actual = Pieza("Cuerpo Principal")
    grupo_temporal_elementos = []

    TIPOS_PUNTOS = [
        "Punto Bajo (pb)",
        "Punto Medio Alto (pma)",
        "Punto Alto (pa)",
        "Punto Doble Bajo",
        "Punto Doble Medio",
        "Punto Doble Alto",
        "Anillo Mágico (am)",
        "Aumento (aum)",
        "Disminución (dism)"
    ]

    lbl_pieza_titulo = ft.Text(f"Pieza: {pieza_actual.nombre}", size=18, weight=ft.FontWeight.BOLD)
    txt_nombre_pieza = ft.TextField(label="Nombre de la Pieza", value=pieza_actual.nombre, expand=True)

    def cambiar_nombre_pieza(e):
        pieza_actual.nombre = txt_nombre_pieza.value
        lbl_pieza_titulo.value = f"Pieza: {pieza_actual.nombre}"
        page.update()

    txt_nombre_pieza.on_blur = cambiar_nombre_pieza

    dd_tipo_punto = ft.Dropdown(
        label="Tipo de Punto Principal",
        options=[ft.dropdown.Option(pt) for pt in TIPOS_PUNTOS],
        value=TIPOS_PUNTOS[0],
        expand=True
    )
    
    class NumericStepper(ft.Row):
        def __init__(self, label: str, initial_value: int = 1, min_val: int = 1):
            super().__init__()
            self.value = initial_value
            self.min_val = min_val
            self.label = label
            
            self.txt_input = ft.TextField(
                value=str(self.value),
                width=65,
                text_align=ft.TextAlign.CENTER,
                keyboard_type=ft.KeyboardType.NUMBER,
                on_blur=self.input_blurred
            )
            
            self.controls = [
                ft.Text(self.label, size=13, weight=ft.FontWeight.W_500),
                ft.IconButton(ft.icons.REMOVE_CIRCLE_OUTLINE, icon_color="purple", on_click=self.decrementar),
                self.txt_input,
                ft.IconButton(ft.icons.ADD_CIRCLE_OUTLINE, icon_color="purple", on_click=self.incrementar)
            ]
            self.alignment = ft.MainAxisAlignment.START

        def incrementar(self, e):
            self.value += 1
            self.txt_input.value = str(self.value)
            self.update()

        def decrementar(self, e):
            if self.value > self.min_val:
                self.value -= 1
                self.txt_input.value = str(self.value)
                self.update()

        def input_blurred(self, e):
            if self.txt_input.value.isdigit():
                val = int(self.txt_input.value)
                if val >= self.min_val:
                    self.value = val
                else:
                    self.txt_input.value = str(self.min_val)
                    self.value = self.min_val
            else:
                self.txt_input.value = str(self.value)
            self.update()

        def get_val(self) -> int:
            if self.txt_input.value.isdigit():
                return int(self.txt_input.value)
            return self.min_val

    stepper_cantidad = NumericStepper("Cantidad del punto:", 1, 1)
    stepper_repeticiones = NumericStepper("Repeticiones del grupo (x N):", 1, 1)

    col_patron_vista = ft.Column()
    col_elementos_grupo = ft.Column()

    def actualizar_vista_grupo():
        col_elementos_grupo.controls.clear()
        for i, el in enumerate(grupo_temporal_elementos):
            dd_sub_tipo = ft.Dropdown(
                options=[ft.dropdown.Option(pt) for pt in TIPOS_PUNTOS],
                value=el.tipo_punto,
                expand=True,
                dense=True,
                on_change=lambda e, idx=i: actualizar_tipo_sub(idx, e.control.value)
            )
            txt_sub_cant = ft.TextField(
                value=str(el.cantidad),
                width=60,
                dense=True,
                keyboard_type=ft.KeyboardType.NUMBER,
                on_blur=lambda e, idx=i: actualizar_cant_sub(idx, e.control.value)
            )
            col_elementos_grupo.controls.append(
                ft.Row([
                    dd_sub_tipo,
                    txt_sub_cant,
                    ft.IconButton(ft.icons.DELETE, icon_color="red", on_click=lambda e, idx=i: eliminar_sub_punto(idx))
                ], alignment=ft.MainAxisAlignment.SPACE_BETWEEN)
            )
        page.update()

    def actualizar_tipo_sub(idx, nuevo_tipo):
        grupo_temporal_elementos[idx].tipo_punto = nuevo_tipo

    def actualizar_cant_sub(idx, nueva_cant):
        if nueva_cant.isdigit() and int(nueva_cant) > 0:
            grupo_temporal_elementos[idx].cantidad = int(nueva_cant)

    def eliminar_sub_punto(idx):
        grupo_temporal_elementos.pop(idx)
        actualizar_vista_grupo()

    def agregar_sub_punto_click(e):
        cant = stepper_cantidad.get_val()
        grupo_temporal_elementos.append(InstruccionPunto(dd_tipo_punto.value, cant))
        actualizar_vista_grupo()

    def actualizar_vista_patron():
        col_patron_vista.controls.clear()
        for index, v in enumerate(pieza_actual.vueltas):
            vueltas_elementos_ui = []
            
            for inst_idx, inst in enumerate(v.instrucciones):
                if isinstance(inst, GrupoRepeticion):
                    sub_elementos_ui = []
                    for sub_i, elem in enumerate(inst.elementos):
                        dd_elem_tipo = ft.Dropdown(options=[ft.dropdown.Option(pt) for pt in TIPOS_PUNTOS], value=elem.tipo_punto, expand=True, dense=True, on_change=lambda e, vi=index, ii=inst_idx, si=sub_i: cambiar_tipo_elemento_grupo(vi, ii, si, e.control.value))
                        txt_elem_cant = ft.TextField(value=str(elem.cantidad), width=50, dense=True, keyboard_type=ft.KeyboardType.NUMBER, on_blur=lambda e, vi=index, ii=inst_idx, si=sub_i: cambiar_cant_elemento_grupo(vi, ii, si, e.control.value))
                        sub_elementos_ui.append(ft.Row([dd_elem_tipo, txt_elem_cant]))

                    txt_rep_g = ft.TextField(value=str(inst.repeticiones), width=60, dense=True, keyboard_type=ft.KeyboardType.NUMBER, on_blur=lambda e, vi=index, ii=inst_idx: cambiar_rep_grupo(vi, ii, e.control.value))
                    
                    vueltas_elementos_ui.append(
                        ft.Container(
                            content=ft.Column([
                                ft.Row([ft.Text("Grupo Repetido:", weight=ft.FontWeight.BOLD, size=12), ft.Text("x"), txt_rep_g]),
                                ft.Column(sub_elementos_ui)
                            ]),
                            bgcolor=ft.colors.GREY_100,
                            padding=8,
                            border_radius=5
                        )
                    )
                else:
                    dd_t = ft.Dropdown(options=[ft.dropdown.Option(pt) for pt in TIPOS_PUNTOS], value=inst.tipo_punto, expand=True, dense=True, on_change=lambda e, vi=index, ii=inst_idx: cambiar_tipo_inst(vi, ii, e.control.value))
                    txt_c = ft.TextField(value=str(inst.cantidad), width=60, dense=True, keyboard_type=ft.KeyboardType.NUMBER, on_blur=lambda e, vi=index, ii=inst_idx: cambiar_cant_inst(vi, ii, e.control.value))
                    vueltas_elementos_ui.append(ft.Row([dd_t, txt_c]))

            col_patron_vista.controls.append(
                ft.Card(
                    content=ft.Container(
                        content=ft.Column([
                            ft.Row([
                                ft.Text(f"Vuelta {v.numero} ({v.total_puntos()} pts)", weight=ft.FontWeight.BOLD, expand=True),
                                ft.IconButton(ft.icons.DELETE, icon_color="red", tooltip="Eliminar vuelta", on_click=lambda e, idx=index: eliminar_vuelta_click(idx))
                            ]),
                            ft.Column(vueltas_elementos_ui)
                        ]),
                        padding=10
                    )
                )
            )
        page.update()

    def cambiar_rep_grupo(vi, ii, val):
        if val.isdigit() and int(val) > 0:
            pieza_actual.vueltas[vi].instrucciones[ii].repeticiones = int(val)
            actualizar_vista_patron()

    def cambiar_tipo_elemento_grupo(vi, ii, si, val):
        pieza_actual.vueltas[vi].instrucciones[ii].elementos[si].tipo_punto = val
        actualizar_vista_patron()

    def cambiar_cant_elemento_grupo(vi, ii, si, val):
        if val.isdigit() and int(val) > 0:
            pieza_actual.vueltas[vi].instrucciones[ii].elementos[si].cantidad = int(val)
            actualizar_vista_patron()

    def cambiar_tipo_inst(vi, ii, val):
        pieza_actual.vueltas[vi].instrucciones[ii].tipo_punto = val
        actualizar_vista_patron()

    def cambiar_cant_inst(vi, ii, val):
        if val.isdigit() and int(val) > 0:
            pieza_actual.vueltas[vi].instrucciones[ii].cantidad = int(val)
            actualizar_vista_patron()

    def agregar_vuelta_click(e):
        nueva_v = Vuelta(len(pieza_actual.vueltas) + 1)
        rep = stepper_repeticiones.get_val()

        if len(grupo_temporal_elementos) > 0:
            grupo = GrupoRepeticion(repeticiones=rep)
            punto_principal = InstruccionPunto(dd_tipo_punto.value, stepper_cantidad.get_val())
            grupo.agregar_elemento(punto_principal)
            for el in grupo_temporal_elementos:
                grupo.agregar_elemento(el)
            nueva_v.agregar_instruccion(grupo)
            grupo_temporal_elementos.clear()
            actualizar_vista_grupo()
        else:
            cant = stepper_cantidad.get_val()
            nueva_v.agregar_instruccion(InstruccionPunto(dd_tipo_punto.value, cant))

        pieza_actual.agregar_vuelta(nueva_v)
        actualizar_vista_patron()

    def eliminar_vuelta_click(idx):
        pieza_actual.eliminar_vuelta(idx)
        actualizar_vista_patron()

    def guardar_archivo_result(e: ft.FilePickerSaveEvent):
        if e.path:
            datos = {
                "pieza": pieza_actual.nombre,
                "marcadores": pieza_actual.marcadores,
                "vueltas": [v.to_dict() for v in pieza_actual.vueltas]
            }
            with open(e.path, "w", encoding="utf-8") as f:
                json.dump(datos, f, indent=4, ensure_ascii=False)
            page.snack_bar = ft.SnackBar(ft.Text(f"Patrón guardado exitosamente en: {e.path}"))
            page.snack_bar.open = True
            page.update()

    def cargar_archivo_result(e: ft.FilePickerResultEvent):
        if e.files:
            file_path = e.files[0].path
            with open(file_path, "r", encoding="utf-8") as f:
                datos = json.load(f)
                pieza_actual.nombre = datos.get("pieza", "Sin nombre")
                txt_nombre_pieza.value = pieza_actual.nombre
                pieza_actual.marcadores = datos.get("marcadores", [])
                
                pieza_actual.vueltas.clear()
                for v_data in datos.get("vueltas", []):
                    v = Vuelta(v_data["numero"])
                    for inst_data in v_data["instrucciones"]:
                        if "elementos" in inst_data:
                            g = GrupoRepeticion(inst_data.get("repeticiones", 1))
                            for sub in inst_data["elementos"]:
                                g.agregar_elemento(InstruccionPunto(sub["tipo_punto"], sub["cantidad"]))
                            v.agregar_instruccion(g)
                        else:
                            v.agregar_instruccion(InstruccionPunto(inst_data["tipo_punto"], inst_data["cantidad"]))
                    pieza_actual.agregar_vuelta(v)
                
                actualizar_vista_patron()
                page.snack_bar = ft.SnackBar(ft.Text("Patrón importado correctamente"))
                page.snack_bar.open = True
                page.update()

    save_file_picker = ft.FilePicker(on_result=guardar_archivo_result)
    load_file_picker = ft.FilePicker(on_result=cargar_archivo_result)
    page.overlay.extend([save_file_picker, load_file_picker])

    page.add(
        ft.AppBar(title=ft.Text("Crostep - Diseñador de Patrones"), bgcolor=ft.colors.PURPLE_400),
        ft.Row([txt_nombre_pieza]),
        lbl_pieza_titulo,
        ft.Divider(),
        
        ft.Text("1. Constructor de Pasos y Grupos Anidados", weight=ft.FontWeight.BOLD),
        ft.Row([dd_tipo_punto]),
        stepper_cantidad,
        ft.ElevatedButton("Añadir paso al grupo actual", on_click=agregar_sub_punto_click, icon=ft.icons.ADD),
        
        ft.Container(
            content=col_elementos_grupo,
            bgcolor=ft.colors.PURPLE_50,
            padding=10,
            border_radius=5
        ),
        
        stepper_repeticiones,
        ft.ElevatedButton("Guardar Vuelta Completa", bgcolor=ft.colors.PURPLE_600, color=ft.colors.WHITE, on_click=agregar_vuelta_click),
        
        ft.Divider(),
        ft.Text("Vista Previa y Edición Directa del Patrón:", weight=ft.FontWeight.BOLD),
        col_patron_vista,
        
        ft.Divider(),
        ft.Row([
            ft.OutlinedButton("Exportar (Guardar JSON)", icon=ft.icons.SAVE, on_click=lambda _: save_file_picker.save_file(file_name="patron_crochet.json")),
            ft.OutlinedButton("Importar (Abrir JSON)", icon=ft.icons.FOLDER_OPEN, on_click=lambda _: load_file_picker.pick_files(allowed_extensions=["json"]))
        ])
    )

ft.app(target=main)