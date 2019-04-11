package edu.eci.arsw.collabpaint.controller;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import edu.eci.arsw.collabpaint.model.Point;
import edu.eci.arsw.collabpaint.model.Polygon;

@Controller
public class STOMPMessagesHandler {


	@Autowired
	SimpMessagingTemplate msgt;

	private  ArrayList<String> dibujos = new ArrayList<String>();
	private  ArrayList<Polygon> poligonos = new ArrayList<Polygon>();

	@MessageMapping("newpoly.{numdibujo}")    
	public void handlePolyEvent(Point pt,@DestinationVariable String numdibujo) throws Exception {
		if(dibujos.contains(numdibujo)==false) {
			dibujos.add(numdibujo);
			Polygon p1= new Polygon(numdibujo);
			p1.addPoint(pt);
			poligonos.add(p1);
		}else {
			for(int i=0;i<poligonos.size();i++) {				
				if(poligonos.get(i).getId().equals(numdibujo)) {
					poligonos.get(i).addPoint(pt);
					if(poligonos.get(i).getPoints().size()>=6) {
						msgt.convertAndSend("/topic/newpoly."+numdibujo, poligonos.get(i).getPoints());
					}
				}
			}
		}
	}

	@MessageMapping("newpoint.{numdibujo}")    
	public void handlePointEvent(Point pt,@DestinationVariable String numdibujo) throws Exception {
		//System.out.println("Nuevo punto recibido en el servidor!:"+pt);		
		msgt.convertAndSend("/topic/newpoint."+numdibujo, pt);
	}
}
