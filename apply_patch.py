# -*- coding: utf-8 -*-
import os

with open('src/data/derouaData.ts', 'r', encoding='utf-8') as f:
    data = f.read()

# Update @SAMU
data = data.replace('\u0627\u0644\u0628\u0643\u062a\u062b\u0627 \t0627\u0644\u0647\u0643\u0645\u062a\u062b\u0621\u062a\u062b (SAMU)', '\u0628\u062d\u0645\u0629 \t0627\u0644\u062b\u062b\u062a\u062b\u062b \u0621\u0645\u0627\u0645\u0629 \u0627\u0644\u062d\u0641\u062a')
data = data.replace("'\u0641\u062a\u062a\u062c\u0648 \u0621\u0627\u0637'dia'", "'\u062c\u062b\u062f \t0627\u0644\u062a\u062a\u0644\u062a: 0666752258 | \u062c\u062b\u062f \u0627\u0644\u0631\u0636\u0627\u0647: 0660625487 | \u0621\u0648\u0621\u0627\u0647: 0626056477'")
data = data.replace("phone: '141'", "phone : '0666752258',\n    secondaryPhone : '0660625487',\n    whatsapp: '212626056477'")

# Update SRM
data = data.replace('\u0627\u0644\u0645\u062c\u062a\u0628 \t0627\u0644\u0647\u0641\u0646\u062a \u0644\u0644\u0645\u0627\u0627 \u0644\u0644\u0643\u0645\u0641\u062a\u0627', '\t0627\u0644\u0638\u0631\u062a\u062a \u0627\u0644\u0646\u0637\u0648\u064b\u0629 \u0645\u062b\u062c\u062d\u062d\u0629 \t0627\u0644\u062b\u062f\u0645\u0621\u062a (SRM)')

with open('src/data/derouaData.ts', 'w', encoding='utf-8') as f:
    f.write(data)

print('data updated successfully')
